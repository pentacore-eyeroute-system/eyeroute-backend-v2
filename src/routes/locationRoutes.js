import express from 'express';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js';
import { authenticateXApiKey } from '../middleware/authenticateIotXApiKey.js';
import { LocationController } from '../controllers/locationController.js';

const router = express.Router();
const locationController = new LocationController();

// POST route
router.post('/push-latest-location/:serialNumber', authenticateXApiKey, locationController.pushLatestLocation); // serial number points to iot serial number

// GET route
router.get('/get-latest-location/:id', authenticateCognitoToken, locationController.getLatestLocation); // id points to pvi id

export default router;