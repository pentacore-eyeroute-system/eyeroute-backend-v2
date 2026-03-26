import { AccountService } from "../services/accountService.js";

const accountService = new AccountService();

export class AccountController {
    registerFamilyMember = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;

            const result = await accountService.registerFamilyMember({ ...req.body, cognitoSub });

            res.status(201).json({
                success: true,
                message : 'Register successful',
                result
            });
        } catch (err) {
            res.status(500).json({
                sucess: false,
                error : err.message
            });
        }
    };

    getFamilyMemberInfo = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;

            const result = await accountService.getFamilyMemberInfo(cognitoSub);

            res.status(200).json({
                success: true,
                message : 'Account info retrieval successful',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error : err.message
            });
        }
    };

    uploadFamilyMemberAccountPic = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;
            const file = req.file;
            // for debugging
            console.log('DEBUG: uploadFamilyMemberAccountPic called');
            console.log('DEBUG: cognitoSub:', cognitoSub);
            console.log('DEBUG: file received:', file ? {
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            } : 'null');

            if (!file) {
                console.log('DEBUG: No file found in request');
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const result = await accountService.uploadFamilyMemberAccountPic(cognitoSub, file);
            //for debugging

            console.log('DEBUG: upload successful, result:', result);

            res.status(200).json({
                success: true,
                message : 'Profile pic upload successful',
                result
            });
        } catch (err) {
            //for debugging
            console.error('DEBUG: upload error:', err);
            res.status(500).json({
                success: false,
                error : err.message
            });
        }
    };

    updateFamilyMemberInfo = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;

            const result = await accountService.updateFamilyMemberInfo({ ...req.body, cognitoSub });

            res.status(200).json({
                success: true,
                message : 'Account info update successful',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error : err.message
            });
        }
    };

    archiveFamilyMemberAccount = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;
            const username = req.user['cognito:username'];

            await accountService.archiveFamilyMemberAccount(cognitoSub, username);

            res.status(200).json({
                success: true,
                message : 'Account archive successful',
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error : err.message
            });
        }
    }; 
}