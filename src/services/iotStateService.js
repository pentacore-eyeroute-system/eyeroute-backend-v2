import { ActiveIoTWearableService } from "./activeIoTWearableService.js";
import { IoTWearableService } from "./ioTWearableService.js";
import { getIoTStateWebSocket } from "../websockets/index.js";

const activeIoTWearableService = new ActiveIoTWearableService();
const iotWearableService = new IoTWearableService();

export class IoTStateService {
    async getBatteryLevelAndStatus(pviId) {
        // Finds active wearable linked to PVI
        const activeIoTWearable = await activeIoTWearableService.findByPviId(pviId);

        return {
            iot_battery_level : activeIoTWearable.act_battery_level,
            iot_status        : activeIoTWearable.act_status,
        }
    };

    async updateBatteryLevelAndStatus(iotSerialNumber, iotWearableData) {
        // Finds iot record based from given serial number
        const iotWearable = await iotWearableService.findIotBySerialNumber(iotSerialNumber);

        if (!iotWearable) {
            throw new Error('Device not found')
        }

        // Finds active iot associated to iot record, and updates battery level and status
        await activeIoTWearableService.updateBatteryLevelAndStatus(iotWearable.id, iotWearableData);

        // Sends latest iot battery level and status to iot state websocket for real-time updates
        const iotWS = getIoTStateWebSocket();

        if (iotWS) {
            iotWS.broadcastIotState(iotWearableData, iotWearable.id);
        } else {
            console.error('WebSocket not initialized');
        }
    };
}