import express from 'express';
import { authenticateXApiKey } from '../middleware/authenticateIotXApiKey.js';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js';
import { StreamController } from '../controllers/streamController.js';

const router = express.Router();
const streamController = new StreamController();

// POST route
router.post('/record-stream-url/:serialNumber', authenticateXApiKey, streamController.recordStreamUrl);

// GET route
router.get('/stream-url/:id', authenticateCognitoToken, streamController.getStreamUrl);

export default router;