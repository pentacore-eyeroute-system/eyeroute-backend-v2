import { NotificationManagementService } from "../services/notificationManagementService.js";

const notificationManagementService = new NotificationManagementService;

export class NotificationController {
    getNotificationsByUser = async (req, res) => {
        try {
            const cognitoSub = req.user.sub;

            const result = await notificationManagementService.getNotificationsByUser(cognitoSub);

            console.log(result);

            res.status(200).json({
                success: true,
                message: 'Notifications retrieval success',
                result
            });
        } catch (err) {
            res.status(500).json({
                sucess: false,
                error : err.message
            });
        }
    };
}