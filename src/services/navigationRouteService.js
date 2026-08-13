import { where } from "sequelize";
import { NavigationRoute } from "../models/navigationRouteModel.js";

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