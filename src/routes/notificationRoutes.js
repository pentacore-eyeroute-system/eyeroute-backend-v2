import express from 'express';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js';
import { NotificationController } from '../controllers/notificationController.js';

const router = express.Router();
const notificationController = new NotificationController();

// POST route
router.post('/record-notification/:serialNumber', authenticateCognitoToken, notificationController.recordNewNotification); // serial number points to iot serial number

// GET route
router.get('/get-notifications', authenticateCognitoToken, notificationController.getNotificationsByUser);

// PUT route
router.put('/update-notification-status/:id', authenticateCognitoToken, notificationController.updateNotificationIsReadStatus);

export default router;