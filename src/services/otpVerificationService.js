import { OtpVerification } from "../models/otpVerificationModel.js";

export class OtpVerificationService {
    async storeOtp(otpData) {
        const otpRecord = await OtpVerification.create({
            ovr_email : otpData.email,
            ovr_hashed_otp : otpData.hashedOtp,
            ovr_expires_at : otpData.expiresAt,
        });

        return otpRecord;
    };

    async findByEmail(email) {
        const otpRecord = await OtpVerification.findOne({ 
            where: { ovr_email : email }, 
            order: [['createdAt', 'DESC']] 
        });

        return otpRecord;
    };
}