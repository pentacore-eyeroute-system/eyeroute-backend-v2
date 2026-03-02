import { FamilyMember } from "../models/familyMemberModel.js";

export class FamilyMemberService {
    async createFamilyMember(data) {
        const familyMember = await FamilyMember.create({
            fam_cognito_sub : data.cognitoSub,
            fam_first_name  : data.famFirstname,
            fam_last_name   : data.famLastname,
            fam_gender      : data.famGender,
        });

        return familyMember.id;
    };

    async getFamilyAccountFileKey(id) {
        const familyMember = await FamilyMember.findByPk(id, {
            attributes: ['fam_profile_pic_path'] 
        });

        return familyMember?.fam_profile_pic_path || null;
    };

    async getFamilyMember(cognitoSub) {
        const familyMember = await FamilyMember.findOne({ where: { fam_cognito_sub: cognitoSub } });

        return familyMember;
    };

    async setFamilyMemberAccountPic(cognitoSub, filePath) {
        const familyMember = await FamilyMember.findOne({ where: { fam_cognito_sub: cognitoSub } });

        if (!familyMember) {
            throw new Error('User not found');
        }

        familyMember.update({ fam_profile_pic_path: filePath });
    };

    async updateFamilyMemberInfo(data) {
        const familyMember = await FamilyMember.findOne({ where: { fam_cognito_sub: data.cognitoSub } });

        familyMember.update({ 
            fam_first_name  : data.famFirstname,
            fam_last_name   : data.famLastname,
            fam_gender      : data.famGender,
        });

        return familyMember;
    };

    async softDeleteFamilyMember(cognitoSub, options = {}) {
        const deletedFamMemberCount = await FamilyMember.destroy({ where: { fam_cognito_sub: cognitoSub } }, options);

        if (deletedFamMemberCount === 0) {
            throw new Error('User not found');
        };
    };
}