import { NavigationRouteManagementService } from "../services/navigationRouteManagementService.js";

const navigationRouteManagementService = new NavigationRouteManagementService();

export class NavigationRouteController {
    addNavigationRoute = async (req, res) => {
        try {
            const iotSerialNumber = req.params.serialNumber;
            const navigationData = {
                destinationName: req.body.destinationName,
                status: req.body.status,
            }

            await navigationRouteManagementService.addNavigationRoute(iotSerialNumber, navigationData);

            res.status(201).json({
                success: true,
                message: 'Navigation route initiation success',
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    getAllRoutesWithDestination = async (req, res) => {
        try {
            const pviId = req.params.id;

            const result = await navigationRouteManagementService.getAllRoutesWithDestination(pviId);

            res.status(200).json({
                success: true,
                message: 'PVI latest location retrieval success',
                result,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    updateNavigationStatus = async (req, res) => {
        try {
            const iotSerialNumber = req.params.serialNumber;
            const navigationData = {
                status: req.body.status,
            }

            await navigationRouteManagementService.updateNavigationStatus(iotSerialNumber, navigationData);

            res.status(201).json({
                success: true,
                message: 'Navigation route update success',
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };
}