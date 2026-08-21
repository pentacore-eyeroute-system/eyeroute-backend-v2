import { RouteHistoryManagementService } from "../services/routeHistoryManagementService.js";

const routeHistoryManagementService = new RouteHistoryManagementService();

export class RouteHistoryController {
    getRouteHistory = async (req, res) => {
        try {
            const pviId = req.params.id;

            const result = await routeHistoryManagementService.getRouteHistory(pviId);

            res.status(200).json({
                success : true,
                message : 'Route history retrieval success',
                result
            });            
        } catch (err) {
            res.status(500).json({
                success : false,
                error : err.message,
            });
        }
    };
}