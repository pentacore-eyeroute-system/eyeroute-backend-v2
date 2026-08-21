import { RouteHistoryManagementService } from "../services/routeHistoryManagementService.js";

const routeHistoryManagementService = new RouteHistoryManagementService();

export class RouteHistoryController {
    getRouteHistory = async (req, res) => {
        try {
            const pviId = req.params.id;
            const page = Math.max(parseInt(req.query.page) || 1, 1);
            const limit = Math.min(parseInt(req.query.limit) || 5, 5);

            const result = await routeHistoryManagementService.getRouteHistory(pviId, page, limit);

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