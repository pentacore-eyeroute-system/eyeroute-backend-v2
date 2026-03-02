import { AuthService } from "../services/authService.js";

const authService = new AuthService();

export class AuthController {
    sendEmailOtp = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;
            const email = req.body.email;

            const result = await authService.sendEmailOtp(email, cognitoSub);

            res.status(201).json({
                success: true,
                message : 'OTP email sent successfully',
                result
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                error : err.message
            });
        }
    };

    verifyEmailOtp = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;
            const otp = req.body.otp;

            const result = await authService.verifyEmailOtp(cognitoSub, otp);

            res.status(200).json({
                success: true,
                message : 'OTP email verified successfully',
                result
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                error : err.message
            });
        }
    };

    getUserEmailByUsername = async (req, res) => {
        try {
            const username = req.body.username;

            if (!username) {
                return res.status(400).json({
                    success: false,
                    error: 'Username is required'
                });
            }

            const email = await authService.getUserEmailByUsername(username);

            res.status(200).json({
                success: true,
                message: 'Email retrieved successfully',
                result: { email }
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }
    };
}