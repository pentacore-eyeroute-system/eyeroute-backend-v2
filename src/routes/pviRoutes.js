import express from 'express';
import { PviController } from '../controllers/pviController.js';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js'; 

const router = express.Router();
const pviController = new PviController();

// POST route
router.post('/create-pvi', authenticateCognitoToken, pviController.createPviAndLinkUser);
router.post('/link-pvi', authenticateCognitoToken, pviController.linkUserToExistingPvi);

// GET route
router.get('/get-linked-apvis-info', authenticateCognitoToken, pviController.getPvisInfo);
router.get('/find-pvi', authenticateCognitoToken, pviController.findPviByPviPublicId);

// PUT route
router.put('/update-pvi-info/:id', authenticateCognitoToken, pviController.updatePviInfoAndRelationship);

// "DELETE route" (archive)
router.put('/archive-pvi/:id', authenticateCognitoToken, pviController.archivePviAndActiveIoT);

export default router;