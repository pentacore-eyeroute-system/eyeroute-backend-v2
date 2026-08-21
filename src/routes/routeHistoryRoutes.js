import express from 'express';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js';
import { RouteHistoryController } from '../controllers/routeHistoryController.js';

const router = express.Router();
const routeHistoryController = new RouteHistoryController();

// GET route
router.get('/:id', authenticateCognitoToken, routeHistoryController.getRouteHistory); // id points to pvi id

export default router;