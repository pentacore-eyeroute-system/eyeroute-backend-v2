import express from 'express';
import { authenticateXApiKey } from '../middleware/authenticateIotXApiKey.js';
import { StreamController } from '../controllers/streamController.js';

const router = express.Router();
const streamController = new StreamController();

// POST route
router.post('/record-stream-url/:serialNumber', authenticateXApiKey, streamController.recordStreamUrl);

export default router;