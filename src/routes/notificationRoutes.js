import express from 'express';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js';
import { NotificationController } from '../controllers/notificationController.js';

const router = express.Router();
const notificationController = new NotificationController();

// GET route
router.get('/get-notifications', authenticateCognitoToken, notificationController.getNotificationsByUser);

// UPDATE route
router.put('/update-notification-status/:id', authenticateCognitoToken, notificationController.updateNotificationIsReadStatus);

export default router;