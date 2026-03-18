import { LocationManagementService } from "../services/locationManagementService.js";

const locationManagementService = new LocationManagementService();

export class LocationController {
    getLatestLocation = async (req, res) => {
        const pviId = req.params.id;

        const result = await locationManagementService.getLatestLocation(pviId);

        try {
            res.status(200).json({
                success : true,
                message : 'PVI latest location retrieval success',
                result
            });
        } catch (err) {
            res.status(500).json({
                success : false,
                error : err.message
            });
        }
    };
}