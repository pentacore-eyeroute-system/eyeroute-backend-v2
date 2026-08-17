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

        // Checks if there is an active navigation associated to active wearable id
        const activeNavigation = await navigationRouteService.checksActiveNavigation(activeWearable.id);

        if (activeNavigation) {
            // If active navigation exists, override it
            const updateNavigationStatus = await navigationRouteService.updateNavigationStatus(activeNavigation.id, { status : "overridden" });
        }

        // Creates new navigation route record
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

        // Update navigation route status
        await navigationRouteService.updateNavigationStatus(navigationRoute.id, navigationData);        
    };

    async getAllRoutesWithDestination(pviId) {
        // Finds active wearable linked to PVI
        const activeIoTWearable = await activeWearableService.findByPviId(pviId);

        if (!activeIoTWearable) {
            throw new Error('Device not found')
        }

        // Returns all navigation history associated to active wearable id
        const navigationRoutes = await navigationRouteService.getAllRoutesWithDestination(activeIoTWearable.id);

        return navigationRoutes;
    };
}