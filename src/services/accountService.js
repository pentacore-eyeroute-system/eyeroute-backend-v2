import { sequelize } from "../config/db.js";

import { FamilyMemberService } from "./familyMemberService.js";
import { FamilyPviLinkService } from "./familyPviLinkService.js";
import { AwsService } from "./awsService.js";

const familyMemberService = new FamilyMemberService();
const familyPviLinkService = new FamilyPviLinkService();
const awsService = new AwsService();

export class AccountService {
    async registerFamilyMember(famData) {
        const familyMemberId = await familyMemberService.createFamilyMember(famData);

            return {
                id : familyMemberId
            };
    };

    async getFamilyMemberAccountPic(id) {
        const fileKey = await familyMemberService.getFamilyAccountFileKey(id);

        if (!fileKey || fileKey == null) {
            return null;
        }

        const preSignedUrl = await awsService.getProfilePicUrl(fileKey);

        return preSignedUrl;
    };

    async getFamilyMemberInfo(cognitoSub) {
        const familyMember = await familyMemberService.getFamilyMember(cognitoSub);
        
        if (!familyMember) {
            throw new Error('User not found');
        }

        const profilePicSignedUrl = await this.getFamilyMemberAccountPic(familyMember.id);

        return {
            id          : familyMember.id,
            firstName   : familyMember.fam_first_name,
            lastName    : familyMember.fam_last_name,
            gender      : familyMember.fam_gender,
            profilePic  : profilePicSignedUrl,
        };
    };

    async uploadFamilyMemberAccountPic(cognitoSub, file) {
        const { fileKey } = await awsService.uploadProfilePic(file);

        await familyMemberService.setFamilyMemberAccountPic(cognitoSub, fileKey);

        return fileKey;
    };  

    async updateFamilyMemberInfo(data) {
        const familyMember = await familyMemberService.updateFamilyMemberInfo(data);

        return {
            id          : familyMember.id,
            firstName   : familyMember.fam_first_name,
            lastName    : familyMember.fam_last_name,
            gender      : familyMember.fam_gender,
        };
    };

    async archiveFamilyMemberAccount(cognitoSub, username) {
        const transaction = await sequelize.transaction();

        try {
            const familyMember = await familyMemberService.getFamilyMember(cognitoSub);

            if (!familyMember) {
                throw new Error('User not found');
            }
            
            await familyPviLinkService.softDeleteFamilyPviLink(familyMember.id, { transaction });

            await familyMemberService.softDeleteFamilyMember(cognitoSub, { transaction });

            await awsService.deleteCognitoUser(username);

            await transaction.commit();
        } catch (err) {
            await transaction.rollback(); // Rollback everything if any step fails
            throw new Error (`${err.message}`);
        }
    };
} 