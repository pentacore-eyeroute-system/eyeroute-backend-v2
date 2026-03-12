import { Notification } from "../models/notificationModel.js";

export class NotificationService {
    async getNotifications(pviId) {
        const notifications = await Notification.findAll({ where : { ntf_linked_pvi_id : pviId } });

        return notifications;
    };
}