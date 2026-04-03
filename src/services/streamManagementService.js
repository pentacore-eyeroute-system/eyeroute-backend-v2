import { IoTWearableService } from "./ioTWearableService.js";
import { ActiveIoTWearableService } from "./activeIoTWearableService.js";
import { StreamService } from "./streamService.js";

const iotWearableService = new IoTWearableService();
const activeWearableService = new ActiveIoTWearableService();
const streamService = new StreamService();

export class StreamManagementService {
    async recordStreamUrl(iotSerialNumber, streamUrl) {
        // Finds iot record based from given serial number
        const iotWearable = await iotWearableService.findIotBySerialNumber(iotSerialNumber);

        if (!iotWearable) {
            throw new Error('Device not found')
        }

        // Finds active iot record associated to iot id
        const activeWearable = await activeWearableService.findByWearableId(iotWearable.id);

        if (!activeWearable) {
            throw new Error('Device not yet activated')
        }

        // Either:
        // a. Creates new stream record
        // b. Updates stream url column of existing record

        await streamService.upsertStream(activeWearable.id, streamUrl);
    };
}