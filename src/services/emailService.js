import nodemailer from 'nodemailer';
import config from '../config/env.js';

const EYEROUTE_EMAIL_ADDRESS = config.email.emailAddress;
const EYEROUTE_EMAIL_PASSWORD = config.email.emailPassword;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EYEROUTE_EMAIL_ADDRESS,
        pass: EYEROUTE_EMAIL_PASSWORD,
    }
});

export class EmailService {
    async sendOtp(recipientEmail, otp) {
        try {
            await transporter.sendMail({
                from: `"EyeRoute" <${EYEROUTE_EMAIL_ADDRESS}>`,
                to: recipientEmail,
                subject: 'Verify your identity',
                text: `
                    Your EyeRoute verification code is: ${otp}.

                    This OTP expires in 1 minute.
                    If you did not request this, you can safely ignore this email.
                `,
            });

            return true;
        } catch (err) {
            throw new Error('OTP email failed to send.');
        }
    };
}