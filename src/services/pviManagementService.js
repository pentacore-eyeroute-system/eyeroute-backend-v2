import { sequelize } from "../config/db.js";

import { FamilyMemberService } from "./familyMemberService.js";
import { PersonWithVisualImpairmentService } from "./personWithVisualImpairmentService.js";
import { FamilyPviLinkService } from "./familyPviLinkService.js";
import { IoTWearableService } from "./ioTWearableService.js";
import { ActiveIoTWearableService } from "./activeIoTWearableService.js";

const familyMemberService = new FamilyMemberService();
const pviService = new PersonWithVisualImpairmentService();
const familyPviLinkService = new FamilyPviLinkService();
const iotWearableService = new IoTWearableService();
const activeIoTWearableService = new ActiveIoTWearableService();

export class PviManagementService {
    async createPviAndLinkUser(cognitoSub, pviData, iotData, relationship) {
        const transaction = await sequelize.transaction();

        try {
            const familyMember = await familyMemberService.getFamilyMember(cognitoSub);
            const familyMemberId = familyMember.id;

            if (!familyMember) {
                throw new Error('User not found');
            }

            const newPviPublicId = await pviService.generatePviPublicId();

            const pviId = await pviService.createPvi(pviData, newPviPublicId, { transaction });

            // Verifies the device serial number from client against table
            const iotWearable = await iotWearableService.findIotBySerialNumber(iotData.inputIoTSerialNumber);

            if (!iotWearable) {
                throw new Error('Device not found');
            };

            // Verifies the user input activation code against table. If it matches, updates activated at timestamp
            await iotWearableService.verifyActivationCode(iotWearable, iotData.inputIoTActivationCode, { transaction });

            // Checks if iot is already owned by existing pvi
            const iotIsAlreadyOwned = await activeIoTWearableService.findByWearableId(iotWearable.id);

            if (iotIsAlreadyOwned) {
                throw new Error('Device is already assigned to another PVI');
            }

            // Adds verified iot to active iot table
            await activeIoTWearableService.addActiveIoT(iotWearable.id, pviId, { transaction });

            // Links user to pvi and adds relationship to table
            const linkId = await familyPviLinkService.setLink(familyMemberId, pviId, relationship, { transaction });

            await transaction.commit();

            return { 
                familyMemberId : familyMemberId,
                pviId          : pviId,
                activeIotId    : iotWearable.id,
                linkId         : linkId,
            }; 
        } catch (err) {
            await transaction.rollback(); // Rollback everything if any step fails
            throw new Error (`${err.message}`);
        }
    };

    async linkUserToExistingPvi(cognitoSub, pviPublicId, relationship) {
        const familyMember = await familyMemberService.getFamilyMember(cognitoSub);
        const familyMemberId = familyMember.id;

        if (!familyMember) {
            throw new Error('User not found');
        }
       
        const pvi = await pviService.findByPviPublicId(pviPublicId);

        if (!pvi) {
            throw new Error("PVI not found");
        }

        const pviId = pvi.id;

        const linkId = await familyPviLinkService.setLink(familyMemberId, pviId, relationship);

        return { 
            familyMemberId : familyMemberId,
            pviId : pviId,
            linkId : linkId,
        };        
    };
    
    async getPvisInfo(cognitoSub){
        const familyMember = await familyMemberService.getFamilyMember(cognitoSub);
        
        if (!familyMember) {
            throw new Error('User not found');
        }

        // Finds all pvi linked to user
        const linkedPvis = await familyPviLinkService.findByFamId(familyMember.id);

        let pvisAndRelationship = [];

        for (let i = 0; i < linkedPvis.length; i++) {
            const pvi = await pviService.findByPviId(linkedPvis[i].relative_linked_pvi_id); // Returns single pvi info
            const relationship = linkedPvis[i].relative_relationship;

            if (!relationship) {
                throw new Error("Relationship is required");
            }

            // Finds active iot linked to PVI
            const activeIoTWearable = await activeIoTWearableService.findByPviId(pvi.id);

            // Finds iot info from the active iot
            const iotWearable = await iotWearableService.findIotById(activeIoTWearable.act_linked_wearable_id);
            
            pvisAndRelationship.push({
                id              : pvi.id,
                publicPviId     : pvi.pvi_public_id,
                firstName       : pvi.pvi_first_name,
                lastName        : pvi.pvi_last_name,
                relationship    : relationship,
                iotId           : iotWearable.id,
                iotSerialNumber : iotWearable.wearable_serial_number,
            });
        };

        return pvisAndRelationship;
    };

    async updatePviInfoAndRelationship(cognitoSub, pviId, newPviData) {
        const transaction = await sequelize.transaction();

        try {
            console.log('Service: updatePviInfoAndRelationship', { cognitoSub, pviId, newPviData });
            const familyMember = await familyMemberService.getFamilyMember(cognitoSub);
            
            if (!familyMember) {
                throw new Error('User not found');
            }

            const updatedPvi = await pviService.updatePviInfo(pviId, newPviData, { transaction });

            const familyPviLink = await familyPviLinkService.updateRelationship(familyMember.id, pviId, newPviData, { transaction });

            await transaction.commit();

            return {
                firstName    : updatedPvi.pvi_first_name,
                lastName     : updatedPvi.pvi_last_name, 
                gender       : updatedPvi.pvi_gender,
                relationship : familyPviLink.relative_relationship
            };
        } catch (err) {
            await transaction.rollback();
            throw new Error (`${err.message}`);
        }
    };

    async archivePviAndActiveIoT(cognitoSub, pviId) {
        const transaction = await sequelize.transaction();

        try {
            const familyMember = await familyMemberService.getFamilyMember(cognitoSub);

            if (!familyMember) {
                throw new Error('User not found');
            }

            await familyPviLinkService.softDeleteFamilyPviLink(familyMember.id, pviId, { transaction });

            await activeIoTWearableService.softDeleteActiveIoT(pviId, { transaction });

            await pviService.softDeletePvi(pviId, { transaction });
            
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error (`${err.message}`);
        }
    };
}