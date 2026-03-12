import { FamilyMemberService } from "./familyMemberService.js";
import { FamilyPviLinkService } from "./familyPviLinkService.js";
import { PersonWithVisualImpairmentService } from "./personWithVisualImpairmentService.js";
import { NotificationService } from "./notificationService.js";
import { NotificationTypeService } from "./notificationTypeService.js";

const userService = new FamilyMemberService();
const userPviLinkService = new FamilyPviLinkService();
const pviService = new PersonWithVisualImpairmentService();
const notificationService = new NotificationService();
const notificationTypeService = new NotificationTypeService();

export class NotificationManagementService {
    async getNotificationsByUser(cognitoSub) {
        const user = await userService.getFamilyMember(cognitoSub);

        if (!user) {
            throw new Error('User not found');
        }

        const linkedPvis = await userPviLinkService.findByFamId(user.id);

        let notifications = [];

        for (let i = 0; i < linkedPvis.length; i++) {
            const linkedPvi = linkedPvis[i];

            const pvi = await pviService.findByPviId(linkedPvi.relative_linked_pvi_id);

            const pviNotifications = await notificationService.getNotifications(linkedPvi.relative_linked_pvi_id);

            let notificationType = "";

            for (let j = 0; j < pviNotifications.length; j++) {
                const pviNotification = pviNotifications[j];

                notificationType = await notificationTypeService.findNotificationTypeById(pviNotification.ntf_linked_notification_type_id);

                notifications.push({
                    pvi_first_name           : pvi.pvi_first_name, // use pvi first name to know which notification belongs to whom
                    notification_title       : notificationType.ntt_title,
                    notification_description : notificationType.ntt_description,
                    notification_is_read     : pviNotification.ntf_is_read,
                });
            }
        }

        return notifications;
    };
}