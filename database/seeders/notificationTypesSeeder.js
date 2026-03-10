import { NotificationType } from "../../src/models/notificationTypeModel.js";

async function seedNotificationTypes() {
    try {
        await NotificationType.bulkCreate([
            {
                ntf_title: 'Low Battery Warning',
                ntf_description: 'The device battery is running low. Please charge your device to avoid interruptions.'
            },
            {
                ntf_title: 'Device Connected',
                ntf_description: 'The device is now online. All functions are available.'
            },
            {
                ntf_title: 'Device Disconnected',
                ntf_description: 'The device is currently offline. Some functions may be unavailable until the connection is restored.'
            },
        ]);

        console.log("Notification types seeded successfully");
        process.exit(0);
    } catch (err) {
        console.log("Notification types seeding error:", err);
        process.exit(1);
    }
};

seedNotificationTypes();