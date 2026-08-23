import { TrackingRoute } from "../models/trackingRouteModel.js";

export class TrackingRouteService {
    async addTrackingRoute(trackingData, options = {}) {
        const trackingRoute = await TrackingRoute.create({
            trk_linked_active_wearable_id : trackingData.activeWearableId,
            trk_type : trackingData.trackingType,
            trk_status : trackingData.status,
            trk_reference_latitude : trackingData.referenceLatitude,
            trk_reference_longitude : trackingData.referenceLongitude,
            trk_movement_stage : trackingData.movementStage,
            trk_accumulated_distance : trackingData.accumulatedDistance,
            trk_stationary_observation_started_at : trackingData.stationaryObservationStartedAt
        }, options);

        return trackingRoute;
    };

    async checksActiveTracking(linkedActiveWearableId) {
        const trackingRouteRecord = await TrackingRoute.findOne({
            where : {
                trk_linked_active_wearable_id : linkedActiveWearableId,
                trk_status : 'active',
            }
        });

        return trackingRouteRecord;
    };

    async updateTrackingType(trackingData, options = {}) {
        await TrackingRoute.update({
                trk_type: trackingData.type
            }, { where: { 
                    id : trackingData.id
                },
                ...options
            }
        );
    }

    async updateMovementStage(trackingData, options = {}) {
        await TrackingRoute.update({
                trk_movement_stage: trackingData.movementStage,
            }, { where: { 
                    id : trackingData.id
                },
                ...options
            }
        );
    }

    async updateAccumulatedDistance(trackingData, options = {}) {
        await TrackingRoute.update({
                trk_accumulated_distance: trackingData.accumulatedDistance,
            }, { where: { 
                    id : trackingData.id
                },
                ...options
            }
        );
    }

    async updateTrackingStatus(trackingData, options = {}) {
        await TrackingRoute.update({
            trk_status: trackingData.status,
        }, { where : { 
                id : trackingData.id
            },
            ...options
        });
    };

    async updateStationaryObservationAt(trackingData, options = {}) {
        await TrackingRoute.update({
            trk_stationary_observation_started_at : trackingData.stationaryObservationStartedAt
        }, { where : { 
                id : trackingData.id
            },
            ...options
        });
    };
}