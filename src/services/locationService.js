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

        return location;
    };
}