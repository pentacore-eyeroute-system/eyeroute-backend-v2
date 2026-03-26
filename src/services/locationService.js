import { Location } from "../models/locationModel.js";

export class LocationService {
    async pushLatestLocation(activeWearableId, iotLatestCoordinates) {
        await Location.create({
            loc_linked_active_wearable_id : activeWearableId,
            loc_latitude : iotLatestCoordinates.latitude,
            loc_longitude : iotLatestCoordinates.longitude,
            loc_recorded_at : iotLatestCoordinates.timestamp, 
        });
    };

    async getLatestLocation(activeWearableId) {
        const location = await Location.findOne({ 
            where : { loc_linked_active_wearable_id : activeWearableId },
            order : [['loc_recorded_at', 'DESC']]  
        });

        return {
            id : location.id,
            loc_latitude : location.loc_latitude,
            loc_longitude : location.loc_longitude,
            loc_last_seen_at : location.loc_recorded_at,
        };
    };
}