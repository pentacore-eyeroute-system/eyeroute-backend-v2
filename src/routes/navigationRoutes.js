import express from 'express';
import { NavigationRouteController } from '../controllers/navigationRouteController.js';
import { authenticateXApiKey } from '../middleware/authenticateIotXApiKey.js';

const router = express.Router();
const navigationRouteController = new NavigationRouteController();

// POST route
router.post('/:serialNumber', authenticateXApiKey, navigationRouteController.addNavigationRoute); // serial number points to iot serial number



export default router;