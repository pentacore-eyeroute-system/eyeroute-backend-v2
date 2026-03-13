import { Notification } from "../models/notificationModel.js";

export class NotificationService {
    async getNotifications(pviId) {
        const notifications = await Notification.findAll({ where : { ntf_linked_pvi_id : pviId } });

        return notifications;
    };

    async updateIsReadStatus(ntfId) {
        const notification = await Notification.findByPk(ntfId);
        
        if (!notification) {
            throw new Error('Notification not found');
        }

        notification.update({
            ntf_is_read: true
        });

        return notification;
    };
}