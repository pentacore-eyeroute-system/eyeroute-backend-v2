import { Notification } from "../models/notificationModel.js";
import { NotificationType } from "../models/notificationTypeModel.js";
import { ActiveIoTWearable } from "../models/activeIoTWearableModel.js";
import { PVI } from "../models/personWithVisualImpairmentModel.js";
import { FamilyPviLink } from "../models/familyPviLinkModel.js";

export class NotificationService {
    async recordNewNotification(notificationData, options = {}) {
        const notification = await Notification.create({
            ntf_linked_active_wearable_id : notificationData.linkedActiveWearableId,
            ntf_linked_notification_type_id : notificationData.linkedNotificationTypeId,
            ntf_is_read : notificationData.isRead,
        }, options);

        return notification;
    };

    async getNotifications(userId, page, limit) {
        const offset = (page - 1) * limit;

        const notifications = await Notification.findAll({
            order: [
                ['createdAt', 'DESC']
            ],
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
            ],
            limit : limit + 1,
            offset : offset
        });

        const hasNextPage = notifications.length > limit;

        return {
            notifications : notifications.slice(0, limit),
            hasNextPage
        };
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