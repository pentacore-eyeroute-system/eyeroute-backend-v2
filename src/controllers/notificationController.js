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

    updateNotificationIsReadStatus = async (req, res) => {
        try {
            const ntfId = req.params.id;

            const result = await notificationManagementService.updateNotificationIsReadStatus(ntfId);

            res.status(200).json({
                success: true,
                message: 'Notification read status update success',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            })
        }
    };
}