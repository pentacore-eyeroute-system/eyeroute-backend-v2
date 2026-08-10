import express from 'express';
import { AuthController } from '../controllers/authController.js';

const router = express.Router();
const authController = new AuthController();

// POST route
router.post('/initiate', authController.initiateOtp);
router.post('/verify', authController.verifyOtp);

export default router;