import { EmailVerification } from "../models/emailVerificationModel.js";

export class EmailVerificationService {
    async addOtpRecord(cognitoSub, email, otp) {
        const record = await EmailVerification.create({
            ver_fam_cognito_sub : cognitoSub,
            ver_fam_email       : email,
            ver_otp             : otp,
            ver_expires_at      : new Date(Date.now() + 60 * 1000),
            ver_is_used         : false,
        });

        return record.id;
    };

    async getOtpRecord(cognitoSub) {
        const record = await EmailVerification.findOne({
            where : {
                ver_fam_cognito_sub : cognitoSub,
                ver_is_used         : false, 
            },
            order : [['createdAt', 'DESC']]
        });

        return record;
    }

    async updateOtpRecord(cognitoSub, verificationData, currentAttempts, isUsed) {
        const record = await EmailVerification.findOne({
            where : {
                ver_fam_cognito_sub : cognitoSub,
                ver_otp             : verificationData.ver_otp, 
            },
        });

        const updatedRecord = await record.update({
            ver_attempts : currentAttempts,
            ver_is_used  : isUsed,
        });

        return updatedRecord;
    }   
}