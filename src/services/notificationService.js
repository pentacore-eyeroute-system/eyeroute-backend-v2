import { Notification } from "../models/notificationModel.js";

export class NotificationService {
    async recordNewNotification(notificationData) {
        const notification = await Notification.create({
            ntf_linked_pvi_id : notificationData.linkedPviId,
            ntf_linked_wearable_id : notificationData.linkedWearableId,
            ntf_linked_notification_type_id : notificationData.linkedNotificationTypeId,
            ntf_is_read : notificationData.isRead,
        });

        return notification;
    };

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