import { Location } from "../models/locationModel.js";

export class LocationService {
    async pushLatestLocation(activeWearableId, iotLatestCoordinates, linkedTrackingRouteId,) {
        await Location.create({
            loc_linked_active_wearable_id: activeWearableId,
            loc_latitude: iotLatestCoordinates.latitude,
            loc_longitude: iotLatestCoordinates.longitude,
            loc_recorded_at: iotLatestCoordinates.timestamp,
            loc_linked_tracking_route_id: linkedTrackingRouteId,
        });
    };

    async getLatestLocation(activeWearableId) {
        return Location.findOne({
            where: { loc_linked_active_wearable_id: activeWearableId },
            order: [['loc_recorded_at', 'DESC']],
            attributes: ['loc_latitude', 'loc_longitude', 'loc_recorded_at'],
            raw: true, // return result as plain object
        });
    };

    async getFirstTrackingRouteLocation(linkedTrackingRouteId) {
        return await Location.findOne({
            where : {
                loc_linked_tracking_route_id: linkedTrackingRouteId,
            },
            order: [['loc_recorded_at', 'ASC']],
            attributes: ['loc_latitude', 'loc_longitude'],
            raw: true, // return result as plain object
        });
    };

    async getLatestTrackingRouteLocation(linkedTrackingRouteId) {
        return await Location.findOne({
            where: {
                loc_linked_tracking_route_id: linkedTrackingRouteId,
            },
            order: 
                [
                    ['loc_recorded_at', 'DESC'],
                    ['id', 'DESC']
                ],
            attributes: ['id', 'loc_latitude', 'loc_longitude', 'loc_recorded_at'],
            raw: true,
        });
    };

    async updateLocationTrackingRouteId(locationId, linkedTrackingRouteId) {
        await Location.update(
            {
                loc_linked_tracking_route_id: linkedTrackingRouteId
            },
            {
                where: {
                    id: locationId
                }
            }
        );
    };
}
