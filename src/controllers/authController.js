import { AuthOrchestratorService } from "../services/authOrchestratorService.js";

const authOrchestratorService = new AuthOrchestratorService();

export class AuthController {
    initiateOtp = async (req, res) => {
        try {
            const otpData = {
                email : req.body.email,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
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
}