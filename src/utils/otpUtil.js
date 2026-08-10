import crypto from 'crypto';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class OtpUtil {
    generateOtp() {
        const otp = crypto.randomInt(100000, 1000000).toString();

        return otp;
    };

    async hashOtp(otp) {
        const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);

        return hashedOtp;
    };

    async compareOtp(submittedOtp, hashedOtp) {
        const isMatch = await bcrypt.compare(submittedOtp, hashedOtp);

        return isMatch;
    };
}