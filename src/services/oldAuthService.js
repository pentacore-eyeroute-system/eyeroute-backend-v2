import { OtpService } from "./otpService.js";
import { EmailService } from "./emailService.js";
import { EmailVerificationService } from "./emailVerificationService.js";
import { CognitoIdentityProviderClient, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import config from "../config/env.js";

const otpService = new OtpService();
const emailService = new EmailService();
const emailVerificationService = new EmailVerificationService();

// Extract region from user pool ID (format: region_poolId, e.g., "ap-southeast-1_bP6vUQUze")
const cognitoRegion = config.cognito.userPoolId.split('_')[0] || 'ap-southeast-1';

const cognitoClient = new CognitoIdentityProviderClient({
    region: cognitoRegion,
    credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
    },
});

export class AuthService {
    async sendEmailOtp(email, cognitoSub) {
        const otp = await otpService.generateEmailOtp();

        const hashedOtp = await otpService.hashOtp(otp);

        await emailService.sendOtp(email, otp);

        const verificationData = await emailVerificationService.addOtpRecord(cognitoSub, email, hashedOtp);
        
        return verificationData;
    }; 

    async verifyEmailOtp(cognitoSub, attemptedOtp) {
        const MAX_ATTEMPTS = 3;

        const verificationRecord = await emailVerificationService.getOtpRecord(cognitoSub);
        const currentAttempts = verificationRecord.ver_attempts;

        if (!verificationRecord) throw new Error('No OTP found');

        const email = verificationRecord.ver_fam_email;

        if (verificationRecord.ver_expires_at < new Date()) {
            await this.sendEmailOtp(email, cognitoSub);
            
            throw new Error('OTP expired. A new OTP has been sent to your email.');
        }

        if (verificationRecord.ver_is_used) {
            throw new Error('OTP already used. Please request a new OTP.');
        }
        
        const isMatch = await otpService.verifyOtp(attemptedOtp, verificationRecord.ver_otp);
        const updatedAttempts = currentAttempts + 1;

        if (!isMatch) {
            await emailVerificationService.updateOtpRecord(cognitoSub, verificationRecord, updatedAttempts, false)
            
            const remainingAttempts = MAX_ATTEMPTS - updatedAttempts;
            
            if (remainingAttempts > 0) {
                throw new Error(`Incorrect OTP. You have ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} left.`);
            } else {
                await this.sendEmailOtp(email, cognitoSub);
                
                throw new Error('Maximum attempts reached. A new OTP has been sent to your email.');
            }
        } else {
            const record = await emailVerificationService.updateOtpRecord(cognitoSub, verificationRecord, updatedAttempts, true)

            return record.id;
        }
    };

    async getUserEmailByUsername(username) {
        try {
            const command = new AdminGetUserCommand({
                UserPoolId: config.cognito.userPoolId,
                Username: username,
            });

            const response = await cognitoClient.send(command);
            
            // Extract email from user attributes
            const emailAttribute = response.UserAttributes?.find(
                attr => attr.Name === 'email'
            );

            if (!emailAttribute || !emailAttribute.Value) {
                throw new Error('Email not found for this user');
            }

            return emailAttribute.Value;
        } catch (error) {
            if (error.name === 'UserNotFoundException') {
                throw new Error('User not found');
            }
            throw error;
        }
    };
}