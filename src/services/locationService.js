import { Location } from "../models/locationModel.js";

export class LocationService {
    async pushLatestLocation(activeWearableId, iotLatestCoordinates) {
        await Location.create({
            loc_linked_active_wearable_id: activeWearableId,
            loc_latitude: iotLatestCoordinates.latitude,
            loc_longitude: iotLatestCoordinates.longitude,
            loc_recorded_at: iotLatestCoordinates.timestamp,
        });
    };

    async getLatestLocation(activeWearableId) {
        const location = await Location.findOne({
            where: { loc_linked_active_wearable_id: activeWearableId },
            order: [['loc_recorded_at', 'DESC']],
            attributes: ['loc_latitude', 'loc_longitude', 'loc_recorded_at'],
            raw: true,
        });

        if (location) {
            // Sequelize returns loc_recorded_at as a JS Date when the column is hydrated
            // normally, but `raw: true` queries on some driver versions can return a string.
            // Coerce to ISO-Z either way so log lines from this layer are directly
            // comparable to [IoT-IN] / [WS-OUT] without timezone guesswork.
            const wire = location.loc_recorded_at instanceof Date
                ? location.loc_recorded_at.toISOString()
                : location.loc_recorded_at;
            console.log('[DB-READ] loc_recorded_at wire=', wire);
        }

        return location;
    };
}
