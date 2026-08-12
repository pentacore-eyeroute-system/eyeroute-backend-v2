import { ActiveIoTWearableService } from "./activeIoTWearableService.js";
import { LocationService } from "./locationService.js";
import { IoTWearableService } from "./ioTWearableService.js";
import { getLocationWebSocket } from "../websockets/index.js";
import { NavigationRouteService } from "./navigationRouteService.js";

const activeWearableService = new ActiveIoTWearableService();
const locationService = new LocationService();
const iotWearableService = new IoTWearableService();
const navigationRouteService = new NavigationRouteService();

export class LocationManagementService {
    async pushLatestLocation(iotSerialNumber, latestCoordinates) {
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

        // Checks if there is active navigation associated to active iot id
        const navigationRoute = await navigationRouteService.checksActiveNavigation(activeWearable.id);

        console.log("Navigation Route Id:", navigationRoute);

        // If there's no active navigation
        if (!navigationRoute) {
            // Stores latest gps coordinates
            await locationService.pushLatestLocation(activeWearable.id, latestCoordinates, null);
        } else {
            // Stores latest gps coordinates
            await locationService.pushLatestLocation(activeWearable.id, latestCoordinates, navigationRoute.id);
        }

        // Sends latest coordinates to location websocket for real-time updates
        const locationWS = getLocationWebSocket();

        if (locationWS) {
            locationWS.broadcastLocation(latestCoordinates, iotWearable.id);
        } else {
            console.error('WebSocket not initialized');
        }
    };

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