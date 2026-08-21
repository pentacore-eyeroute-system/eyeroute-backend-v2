import { ActiveIoTWearableService } from "./activeIoTWearableService.js";
import { RouteHistoryService } from "./routeHistoryService.js";

const activeWearableService = new ActiveIoTWearableService();
const routeHistoryService = new RouteHistoryService();

export class RouteHistoryManagementService {
    async getRouteHistory(pviId, page, limit) {
        // Finds active wearable linked to PVI
        const activeIoTWearable = await activeWearableService.findByPviId(pviId);

        if (!activeIoTWearable) {
            throw new Error('Device not found')
        }

        const routes = await routeHistoryService.getRouteHistory(activeIoTWearable.id, page, limit);

        return routes;
    }
}