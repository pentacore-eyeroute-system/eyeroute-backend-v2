import { FamilyPviLink } from "../models/familyPviLinkModel.js";

export class FamilyPviLinkService {
    async findByFamId(id) {
        const pvis = await FamilyPviLink.findAll({ where: { relative_linked_fam_id: id } });

        return pvis;
    };

    async setLink(familyMemberId, pviId, relationship, options = {}) { 
        const familyPviLink = await FamilyPviLink.create({
            relative_linked_fam_id : familyMemberId,
            relative_linked_pvi_id : pviId,
            relative_relationship  : relationship
        }, { ...options });
       
        return familyPviLink.id;
    };

    async updateRelationship(familyMemberId, pviId, newPviData, options = {}) {
        const familyPviLink = await FamilyPviLink.findOne({ 
            where: { 
                relative_linked_fam_id : familyMemberId, 
                relative_linked_pvi_id : pviId 
            } 
        });

        console.log('Service: updateRelationship found link:', familyPviLink ? familyPviLink.id : 'null');

        await familyPviLink.update({ 
            relative_relationship : newPviData.relationship
        }, { ...options });

        return familyPviLink;
    };

    async softDeleteFamilyPviLink(familyMemberId, pviId, options = {}) {
        const familyPviLink = await FamilyPviLink.findOne({ 
            where: { 
                relative_linked_fam_id : familyMemberId, 
                relative_linked_pvi_id : pviId 
            },
        });

        if (!familyPviLink) {
            throw new Error('No link found to PVI');
        }

        await familyPviLink.destroy({ ...options });
    };
}