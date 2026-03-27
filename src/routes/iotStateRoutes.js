import express from 'express';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js';
import { IoTStateController } from '../controllers/iotStateController.js';

const router = express.Router();
const iotStateController = new IoTStateController();

// GET route
router.get('/level-and-status/:id', authenticateCognitoToken, iotStateController.getBatteryLevelAndStatus); // id points to pvi id

// PUT route
router.put('/update-level-and-status/:serialNumber', authenticateCognitoToken, iotStateController.updateBatteryLevelAndStatus); // serial number points to iot serial number

export default router;