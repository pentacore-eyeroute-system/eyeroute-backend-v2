import { IoTWearableService } from "./ioTWearableService.js";
import { ActiveIoTWearableService } from "./activeIoTWearableService.js";
import { NavigationRouteService } from "./navigationRouteService.js";

const iotWearableService = new IoTWearableService();
const activeWearableService = new ActiveIoTWearableService();
const navigationRouteService = new NavigationRouteService();

export class NavigationRouteManagementService {
    async addNavigationRoute(iotSerialNumber, navigationData) {
        // Finds iot record based from given serial number
        const iotWearable = await iotWearableService.findIotBySerialNumber(iotSerialNumber);

        if (!iotWearable) {
            throw new Error('Device not found');
        }

        // Finds active iot record associated to iot id
        const activeWearable = await activeWearableService.findByWearableId(iotWearable.id);

        if (!activeWearable) {
            throw new Error('Device not yet activated');
        }

        // Creates navigation route record
        await navigationRouteService.addNavigationRoute({ ...navigationData, activeWearableId: activeWearable.id});
    };

    async updateNavigationStatus(iotSerialNumber, navigationData) {
        // Finds iot record based from given serial number
        const iotWearable = await iotWearableService.findIotBySerialNumber(iotSerialNumber);

        if (!iotWearable) {
            throw new Error('Device not found');
        }

        // Finds active iot record associated to iot id
        const activeWearable = await activeWearableService.findByWearableId(iotWearable.id);

        if (!activeWearable) {
            throw new Error('Device not yet activated');
        }

        // Checks if there is active navigation associated to active iot id
        const navigationRoute = await navigationRouteService.checksActiveNavigation(activeWearable.id);

        if (!navigationRoute) {
            throw new Error('No active navigation found');
        }

        // Update navigation route status and completed/ cancelled timestamp
        await navigationRouteService.updateNavigationStatus(navigationRoute.id, navigationData);        
    };
}