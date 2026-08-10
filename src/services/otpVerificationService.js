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

    async updateAttemptsAndBlockedTime(otpRecord, attempts, blockedUntil) {
        await otpRecord.update({
            ovr_attempts: attempts,
            ovr_blocked_until: blockedUntil,
        });
    };

    async updateIsUsed(otpRecord, isUsed) {
        await otpRecord.update({
            ovr_is_used: isUsed,
        });
    };
}