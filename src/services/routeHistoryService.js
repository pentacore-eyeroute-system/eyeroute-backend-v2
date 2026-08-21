import { TrackingRoute } from "../models/trackingRouteModel.js";
import { Location } from "../models/locationModel.js";

export class RouteHistoryService {
    async getRouteHistory(linkedActiveWearableId, page, limit) {
        const offset = (page - 1) * limit;

        const routes = await TrackingRoute.findAll({
            where: {
                trk_linked_active_wearable_id : linkedActiveWearableId,
                trk_status : 'completed'
            },
            include: [
                {
                    model: Location,
                    as: 'locationCoordinates',
                    required: true,
                }
            ],
            order: [
                ['createdAt', 'DESC'],
                [
                    { model: Location, as: 'locationCoordinates' },
                    'loc_recorded_at',
                    'ASC'
                ]
            ],
            limit : limit + 1,
            offset : offset
        });

        const hasNextPage = routes.length > limit;

        const paginatedRoutes = routes.slice(0, limit);

        const routeHistory = paginatedRoutes.map(route => {
            const locations = route.locationCoordinates;
            
            const startedAt = locations[0]?.loc_recorded_at ?? null;

            const endedAt =
                route.trk_type === 'moving'
                    ? locations[locations.length - 1]?.loc_recorded_at ?? null
                    : null;

            const distance =
                route.trk_type === 'moving'
                    ? Number(route.trk_accumulated_distance) < 1000
                        ? `${Number(route.trk_accumulated_distance).toFixed(0)} m`
                        : `${(Number(route.trk_accumulated_distance) / 1000).toFixed(2)} km`
                    : null;

            let duration = null;

            if (
                route.trk_type === 'moving' &&
                startedAt &&
                endedAt
            ) {
                const durationMs = new Date(endedAt) - new Date(startedAt);

                const durationSeconds = durationMs / 1000;

                if (durationSeconds < 60) {
                    duration = `${Math.round(durationSeconds)} sec`;
                } else {
                    const durationMinutes = durationSeconds / 60;

                    if (durationMinutes < 60) {
                        duration = `${Math.round(durationMinutes)} min`;
                    } else {
                        const hours = durationMinutes / 60;
                        duration = `${hours.toFixed(1)} hour${hours !== 1 ? 's' : ''}`;
                    }
                }
            }

            const location =
                route.trk_type === 'stationary'
                    ? locations.slice(0, 1).map(location => ({
                        latitude: Number(location.loc_latitude),
                        longitude: Number(location.loc_longitude),
                    }))
                    : locations.map(location => ({
                        latitude: Number(location.loc_latitude),
                        longitude: Number(location.loc_longitude),
                    }))

            return {
                id: route.id,
                type: route.trk_type,
                startedAt,
                endedAt,
                distance,
                duration,
                location
            };
        });

        return {
            routeHistory,
            hasNextPage
        }
    };
}