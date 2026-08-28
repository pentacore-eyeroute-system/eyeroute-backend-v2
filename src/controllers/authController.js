import { AuthOrchestratorService } from "../services/authOrchestratorService.js";
import { signUpOtpSchema, forgotPasswordOtpSchema } from "../validation/userValidation.js";

const authOrchestratorService = new AuthOrchestratorService();

export class AuthController {
    initiateOtp = async (req, res) => {
        try {
            const otpData = {
                email : req.body.email,
                flow: req.body.flow, // either sign-up or null
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
            let parsedData;

            if (req.body.flow === 'sign-up') {
                parsedData = signUpOtpSchema.safeParse({
                    ...req.body,
                });
            } 
            else if (req.body.flow === 'forgot-password') {
                parsedData = forgotPasswordOtpSchema.safeParse({
                    ...req.body,
                });
            } 
            else {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid verification flow.'
                });
            }

            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    error: parsedData.error.flatten().fieldErrors
                });
            }

            const verificationData = {
                ...parsedData.data,
                flow: req.body.flow // "sign-up" or "forgot-password"
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