import { ActiveIoTWearableService } from "./activeIoTWearableService.js";

const activeIoTWearableService = new ActiveIoTWearableService();

export class IoTStateService {
    async getBatteryLevelAndStatus(pviId) {
        // Finds active wearable linked to PVI
        const activeIoTWearable = await activeIoTWearableService.findByPviId(pviId);

        return {
            iot_battery_level : activeIoTWearable.act_battery_level,
            iot_status        : activeIoTWearable.act_status,
        }
    };
}