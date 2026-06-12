import { Notification } from "../models/notificationModel.js";
import { NotificationType } from "../models/notificationTypeModel.js";
import { ActiveIoTWearable } from "../models/activeIoTWearableModel.js";
import { PVI } from "../models/personWithVisualImpairmentModel.js";
import { FamilyPviLink } from "../models/familyPviLinkModel.js";

export class NotificationService {
    async recordNewNotification(notificationData) {
        const notification = await Notification.create({
            ntf_linked_active_wearable_id : notificationData.linkedActiveWearableId,
            ntf_linked_notification_type_id : notificationData.linkedNotificationTypeId,
            ntf_is_read : notificationData.isRead,
        });

        return notification;
    };

    async getNotifications(userId) {
        const notifications = await Notification.findAll({
            include: [
                {
                    model: ActiveIoTWearable,
                    required: true,
                    include: [
                        {
                            model: PVI,
                            required: true,
                            include: [
                                {
                                    model: FamilyPviLink,
                                    required: true,
                                    where: { relative_linked_fam_id : userId }
                                }
                            ]
                        }
                    ]
                },
                {
                    model: NotificationType,
                    required: true,
                }
            ]
        });

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