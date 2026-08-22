/*
    FCM: New route file added for push notifications.

    Kept separate from accountRoutes so enabling push does not touch the existing
    account endpoints. Both routes are authenticated: a device token is tied to
    the signed-in family member.
*/
import express from 'express';
import { DeviceTokenController } from '../controllers/deviceTokenController.js';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js';

const router = express.Router();
const deviceTokenController = new DeviceTokenController();

// POST route
router.post('/register-device-token', authenticateCognitoToken, deviceTokenController.registerDeviceToken);

// "DELETE" route (uses POST so the token can travel in the body)
router.post('/unregister-device-token', authenticateCognitoToken, deviceTokenController.unregisterDeviceToken);

export default router;
