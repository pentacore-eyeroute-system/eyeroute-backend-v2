import { Location } from "../models/locationModel.js";

export class LocationService {
    async getLatestLocation(activeWearableId) {
        const location = await Location.findOne({ 
            where : { loc_linked_active_wearable_id : activeWearableId },
            order : [['loc_recorded_at', 'DESC']]  
        });

        return location;
    };
}