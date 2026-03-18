import express from 'express';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js';
import { LocationController } from '../controllers/locationController.js';

const router = express.Router();
const locationController = new LocationController();

// GET route
router.get('/latest-location/:id', authenticateCognitoToken, locationController.getLatestLocation); // id points to pvi id

export default router;
