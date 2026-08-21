import express from 'express';
import { NavigationRouteController } from '../controllers/navigationRouteController.js';
import { authenticateXApiKey } from '../middleware/authenticateIotXApiKey.js';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js';

const router = express.Router();
const navigationRouteController = new NavigationRouteController();

// POST route
router.post('/:serialNumber/with-destination', authenticateXApiKey, navigationRouteController.addNavigationRoute); // serial number points to iot serial number

// GET route
router.get('/:id/with-destination', authenticateCognitoToken, navigationRouteController.getAllRoutesWithDestination); // id points to pvi id

// PATCH route
router.patch('/:serialNumber/with-destination/status', authenticateXApiKey, navigationRouteController.updateNavigationStatus); // serial number points to iot serial number

export default router;