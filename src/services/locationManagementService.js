import { ActiveIoTWearableService } from "./activeIoTWearableService.js";
import { LocationService } from "./locationService.js";

const activeWearableService = new ActiveIoTWearableService();
const locationService = new LocationService();

export class LocationManagementService {
    async getLatestLocation(pviId) {
        // Finds active wearable linked to PVI
        const activeIoTWearable = await activeWearableService.findByPviId(pviId);

        if (!activeIoTWearable) {
            throw new Error('Device not found')
        }

        // Retrieves latest location by giving active wearable id
        const location = await locationService.getLatestLocation(activeIoTWearable.id);   

        return location;
    };
}