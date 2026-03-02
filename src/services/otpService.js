import bcrypt from 'bcrypt';
import NodemailerHelper from 'nodemailer-otp';
import config from '../config/env.js';

const EYEROUTE_EMAIL_ADDRESS = config.email.emailAddress;
const EYEROUTE_EMAIL_PASSWORD = config.email.emailPassword;

const helper = new NodemailerHelper(EYEROUTE_EMAIL_ADDRESS, EYEROUTE_EMAIL_PASSWORD);

export class OtpService {
    async generateEmailOtp() {
        const otp = await helper.generateOtp(6);

        return otp;
    };

    async hashOtp(otp) {
        const SALT_ROUNDS = 10;

        const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);

        return hashedOtp;
    };

    async verifyOtp(attemptedOtp, validOtp) {
        const isMatch = await bcrypt.compare(attemptedOtp, validOtp);

        return isMatch;
    };
}