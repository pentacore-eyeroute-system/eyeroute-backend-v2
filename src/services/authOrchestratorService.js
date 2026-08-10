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

        return otpRecord;
    };

    async verifyOtp() {
        
    };
}