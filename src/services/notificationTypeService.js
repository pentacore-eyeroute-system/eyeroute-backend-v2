import { NotificationType } from "../models/notificationTypeModel.js";

export class NotificationTypeService {
    async findNotificationTypeById(nttId) {
        const notificationType = await NotificationType.findByPk(nttId);

        return notificationType;
    };
}