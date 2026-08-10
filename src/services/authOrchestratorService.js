import { OtpUtil } from "../utils/otpUtil.js";
import { OtpVerificationService } from "./otpVerificationService.js";
import { AwsService } from "./awsService.js";
import { otpEmailTemplate } from "../templates/otpEmail.js";

const otpUtil = new OtpUtil();
const otpVerificationService = new OtpVerificationService();
const awsService = new AwsService();

export class AuthOrchestratorService {
    async initiateOtp(otpData) {
        // Generate otp
        const otp = otpUtil.generateOtp();

        // Hash otp
        const hashedOtp = await otpUtil.hashOtp(otp);

        // Store otp
        const otpRecord = await otpVerificationService.storeOtp({
            ...otpData,
            hashedOtp
        });

        // Create email
        const { subject, body } = otpEmailTemplate(otp);

        // Send otp through email
        await awsService.sendEmail(otpData.email, subject, body);
    };

    async verifyOtp(verificationData) {
        // Retrieve latest otp record associated to recipient's email
        const otpRecord = await otpVerificationService.findByEmail(verificationData.email);

        // Check if otp has been used
        if (otpRecord.ovr_is_used) {
            throw new Error('OTP has already been used.');
        }

        // Check if otp is already expired
        if (new Date() > otpRecord.ovr_expires_at) {
            throw new Error('OTP is already expired.')
        }

        // Check if user is still blocked from requesting new otp
        if (otpRecord.ovr_blocked_until && 
            new Date() < otpRecord.ovr_blocked_until) {
            throw new Error('Too many attempts. Try again later.')
        }

        // Compare submitted otp from stored otp
        const isMatch = await otpUtil.compareOtp(verificationData.otp, otpRecord.ovr_hashed_otp);

        // If not matching
        if (!isMatch) {
            const NEW_ATTEMPTS = otpRecord.ovr_attempts + 1;

            // Check if new attempts reaches maximum attempt which is 3
            if (NEW_ATTEMPTS >= 3) {
                const BLOCKED_UNTIL = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes        

                await otpVerificationService.updateAttemptsAndBlockedTime(otpRecord, NEW_ATTEMPTS, BLOCKED_UNTIL);

                throw new Error('Too many attempts. Try again later.');
            }  

            await otpVerificationService.updateAttemptsAndBlockedTime(otpRecord, NEW_ATTEMPTS, null);
            
            throw new Error('Incorrect OTP.');
        }
        
        // Update is used if valid otp
        await otpVerificationService.updateIsUsed(otpRecord, true);
    };
}