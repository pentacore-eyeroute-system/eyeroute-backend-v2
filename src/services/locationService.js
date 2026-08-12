import { Location } from "../models/locationModel.js";

export class LocationService {
    async pushLatestLocation(activeWearableId, iotLatestCoordinates, linkedNavigationRouteId) {
        await Location.create({
            loc_linked_active_wearable_id: activeWearableId,
            loc_latitude: iotLatestCoordinates.latitude,
            loc_longitude: iotLatestCoordinates.longitude,
            loc_recorded_at: iotLatestCoordinates.timestamp,
            loc_linked_navigation_route_id: linkedNavigationRouteId,
        });
    };

    async getLatestLocation(activeWearableId) {
        return Location.findOne({
            where: { loc_linked_active_wearable_id: activeWearableId },
            order: [['loc_recorded_at', 'DESC']],
            attributes: ['loc_latitude', 'loc_longitude', 'loc_recorded_at'],
            raw: true,
        });
    };
}
