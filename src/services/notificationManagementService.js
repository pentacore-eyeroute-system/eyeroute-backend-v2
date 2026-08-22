import { FamilyMemberService } from "./familyMemberService.js";
import { FamilyPviLinkService } from "./familyPviLinkService.js";
import { PersonWithVisualImpairmentService } from "./personWithVisualImpairmentService.js";
import { NotificationService } from "./notificationService.js";
import { NotificationTypeService } from "./notificationTypeService.js";
import { IoTWearableService } from "./ioTWearableService.js";
import { ActiveIoTWearableService } from "./activeIoTWearableService.js";
import { getNotificationWebSocket } from "../websockets/index.js";
// FCM: added so a recorded notification is also pushed to devices whose
// app is backgrounded or closed (the websocket above only reaches a
// running, connected app).
import { FcmService } from "./fcmService.js";
import { DeviceTokenService } from "./deviceTokenService.js";

const userService = new FamilyMemberService();
const userPviLinkService = new FamilyPviLinkService();
const pviService = new PersonWithVisualImpairmentService();
const notificationService = new NotificationService();
const notificationTypeService = new NotificationTypeService();
const iotWearableService = new IoTWearableService();
const activeIoTWearableService = new ActiveIoTWearableService();
// FCM: added for push notifications.
const fcmService = new FcmService();
const deviceTokenService = new DeviceTokenService();

export class NotificationManagementService {
    async recordNewNotification(iotSerialNumber, iotWearableData) {
        const LOW_BATTERY_LEVEL = 20;
        const NOTIFICATION_TYPES_ID = {
            LOW_BATTERY: 1,
            CONNECTED: 2,
            DISCONNECTED: 3,
        };

        // Finds iot record based from given serial number
        const iotWearable = await iotWearableService.findIotBySerialNumber(iotSerialNumber);

        if (!iotWearable) {
            throw new Error('Device not found')
        }

        // Finds active iot record based from iot id
        const activeIoTWearable = await activeIoTWearableService.findByWearableId(iotWearable.id);

        // Sets incomplete notification data to store in db
        const baseNotificationData = {
            linkedActiveWearableId : activeIoTWearable.id,
            isRead : false,
        };

        // Collects all notifications first to store in db
        const notificationsToStore = [];

        // Checks iot battery level
        if (iotWearableData.batteryLevel <= LOW_BATTERY_LEVEL) {
            notificationsToStore.push({
                ...baseNotificationData,
                linkedNotificationTypeId : NOTIFICATION_TYPES_ID.LOW_BATTERY
            });
        }

        // Checks iot status
        if (iotWearableData.status === 'Online') {
            notificationsToStore.push({
                ...baseNotificationData,
                linkedNotificationTypeId : NOTIFICATION_TYPES_ID.CONNECTED
            });
        } else {
            notificationsToStore.push({
                ...baseNotificationData,
                linkedNotificationTypeId : NOTIFICATION_TYPES_ID.DISCONNECTED
            });
        }

        // Calls notification websocket instantiation
        const notificationWS = getNotificationWebSocket();

        // Loops notifications individually before storing in db
        for (let i = 0; i < notificationsToStore.length; i++) {
            // Stores notification data in db
            const notification = await notificationService.recordNewNotification(notificationsToStore[i]);

            // Retrieves notification details like title and description given notification_type id
            const notificationType = await notificationTypeService.findNotificationTypeById(notification.ntf_linked_notification_type_id);

            // Finds pvi associated to active iot wearable 
            const pvi = await pviService.findByPviId(activeIoTWearable.act_linked_pvi_id);

            const notificationToSend = {
                id                       : notification.id,
                pvi_first_name           : pvi.pvi_first_name, // use pvi first name to know which notification belongs to whom
                notification_title       : notificationType.ntt_title,
                notification_description : notificationType.ntt_description,
                notification_is_read     : notification.ntf_is_read,
                notification_timestamp   : notification.createdAt,
            };

            // Sends latest notification to location notification for real-time updates
            if (notificationWS) {
                notificationWS.broadcastNotification(notificationToSend, iotWearable.id); // notification record from db is sent along with id
            } else {
                console.error('WebSocket not initialized');
            }

            /*
                FCM: added for push notifications.

                Delivers the same notification to the OS of every device
                belonging to the family members linked to this PVI, which is what
                reaches them while the app is backgrounded or closed.

                Deliberately awaited but never allowed to throw: the notification
                is already stored and broadcast, so a Firebase problem must not
                fail the IoT device's request.
            */
            try {
                const deviceTokens = await deviceTokenService.findTokensByPviId(pvi.id);

                if (deviceTokens.length > 0) {
                    const { invalidTokens } = await fcmService.sendToTokens(deviceTokens, {
                        title : notificationType.ntt_title,
                        body  : `${pvi.pvi_first_name}: ${notificationType.ntt_description}`,
                        data  : {
                            notification_id   : String(notification.id),
                            notification_type : String(notification.ntf_linked_notification_type_id),
                            pvi_id            : String(pvi.id),
                        },
                    });

                    // Stops dead tokens from being retried on every notification.
                    await deviceTokenService.removeTokens(invalidTokens);
                }
            } catch (err) {
                console.error('FCM: push notification step failed:', err.message);
            }
        };
    };

    async getNotificationsByUser(cognitoSub, page, limit) {
        const user = await userService.getFamilyMember(cognitoSub);

        if (!user) {
            throw new Error('User not found');
        }

        const result = await notificationService.getNotifications(user.id, page, limit);

        return {
            notifications : result.notifications.map(notification => ({
                id: notification.id,
                pvi_id: notification.ActiveIoTWearable.PVI.id,
                pvi_first_name: notification.ActiveIoTWearable.PVI.pvi_first_name,
                notification_title: notification.NotificationType.ntt_title,
                notification_description: notification.NotificationType.ntt_description,
                notification_is_read: notification.ntf_is_read,
                notification_timestamp: notification.createdAt,
                })
            ),
            hasNextPage: result.hasNextPage
        }
    };

    async updateNotificationIsReadStatus(ntfId) {
        const updatedNotification = await notificationService.updateIsReadStatus(ntfId);

        return updatedNotification;
    };
}