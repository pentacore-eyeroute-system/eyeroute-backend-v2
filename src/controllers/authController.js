import { AuthOrchestratorService } from "../services/authOrchestratorService.js";

const authOrchestratorService = new AuthOrchestratorService();

export class AuthController {
    initiateOtp = async (req, res) => {
        try {
            const otpData = {
                email : req.body.email,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes,
            };

            const result = await authOrchestratorService.initiateOtp(otpData);
        
            res.status(200).json({
                success: true,
                message: 'An OTP has been sent to your email.',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    verifyOtp = async (req, res) => {
        try {
            const verificationData = {
                email: req.body.email,
                otp: String(req.body.otp),
            }

            const result = await authOrchestratorService.verifyOtp(verificationData);

            if (result.blocked) {
                return res.status(429).json({
                    success: false,
                    error: 'Too many attempts. Try again later.',
                    result
                });
            }

            res.status(200).json({
                success: true,
                message: 'Verification successful',
            });            
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };
}