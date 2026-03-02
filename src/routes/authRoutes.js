import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js'; 

const router = express.Router();
const authController = new AuthController();

// POST route
router.post('/send-otp', authenticateCognitoToken, authController.sendEmailOtp);
router.post('/verify-otp', authenticateCognitoToken, authController.verifyEmailOtp);
// Public route for forgot password - get email by username
router.post('/get-email-by-username', authController.getUserEmailByUsername);

export default router;