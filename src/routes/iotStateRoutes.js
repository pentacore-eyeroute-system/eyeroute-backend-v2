import express from 'express';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js';
import { IoTStateController } from '../controllers/iotStateController.js';

const router = express.Router();
const iotStateController = new IoTStateController();

// GET route
router.get('/level-and-status/:id', authenticateCognitoToken, iotStateController.getBatteryLevelAndStatus); // id points to pvi id

export default router;