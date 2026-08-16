import { where } from "sequelize";
import { NavigationRoute } from "../models/navigationRouteModel.js";
import { Location } from "../models/locationModel.js";

export class NavigationRouteService {
    async addNavigationRoute(navigationData) {
        await NavigationRoute.create({
            nav_linked_active_wearable_id: navigationData.activeWearableId,
            nav_destination_name: navigationData.destinationName,
            nav_status: navigationData.status,
            nav_started_at: navigationData.startedAt,
        });
    };

    async checksActiveNavigation(linkedActiveWearableId) {
        const navigationRouteRecord = await NavigationRoute.findOne({ 
            where : {
                nav_linked_active_wearable_id: linkedActiveWearableId,
                nav_status: 'active'
            }
        });

        return navigationRouteRecord;
    };

    async getAllRoutesWithDestination(activeWearableId) {
        const navigationRoutes = await NavigationRoute.findAll({
            where: {
                nav_linked_active_wearable_id : activeWearableId
            },
            include: [
                {
                    model: Location,
                    as: 'locationCoordinates',
                    required: true,
                }
            ],
            order : [
                [
                    { model: Location, as: 'locationCoordinates' }, 
                    'loc_recorded_at', 
                    'ASC'
                ]
            ]
        });

        return navigationRoutes.map(route => ({
            id: route.id,
            destinationName: route.nav_destination_name,
            status: route.nav_status,
            startedAt: route.locationCoordinates[0].loc_recorded_at,
            completedAt: route.locationCoordinates[route.locationCoordinates.length - 1].loc_recorded_at,
            cancelledAt: route.nav_cancelled_at,
            locationPoints: route.locationCoordinates.map(location => ({
                latitude: location.loc_latitude,
                longitude: location.loc_longitude,
            }))
        }));
    };


    async updateNavigationStatus(navigationRouteId, navigationData) {
        await NavigationRoute.update({
            nav_status: navigationData.status,
            nav_completed_at: navigationData.completedAt,
            nav_cancelled_at: navigationData.cancelledAt,
        }, { where : { 
                id : navigationRouteId
            }
        });
    };
}