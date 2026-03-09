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

            if (!file) return res.status(400).json({ error: 'No file uploaded' });

            const result = await accountService.uploadFamilyMemberAccountPic(cognitoSub, file);

            res.status(200).json({
                success: true,
                message : 'Profile pic upload successful',
                result
            });
        } catch (err) {
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