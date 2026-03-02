import express from 'express';
import multer from 'multer';
import { AccountController } from '../controllers/accountController.js';
import { authenticateCognitoToken } from '../middleware/authenticateToken.js'; 

const router = express.Router();
const accountController = new AccountController();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route
router.post('/register-fam-member', authenticateCognitoToken, accountController.registerFamilyMember);

// GET route
router.get('/get-fam-member-info', authenticateCognitoToken, accountController.getFamilyMemberInfo);

// PUT route
router.put('/upload-profile-pic', authenticateCognitoToken, upload.single('image'), accountController.uploadFamilyMemberAccountPic);
router.put('/update-fam-member-info', authenticateCognitoToken, accountController.updateFamilyMemberInfo);

// "DELETE" route (Archive)
router.put('/archive-fam-member', authenticateCognitoToken, accountController.archiveFamilyMemberAccount);

export default router;