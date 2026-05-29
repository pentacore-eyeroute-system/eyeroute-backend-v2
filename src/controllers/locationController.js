import { LocationManagementService } from "../services/locationManagementService.js";

const locationManagementService = new LocationManagementService();

export class LocationController {
    pushLatestLocation = async (req, res) => {
        try {
            const iotSerialNumber = req.params.serialNumber;

            // IoT firmware emits a naive PHT (UTC+08:00) wallclock string. Tag the offset
            // explicitly so the resulting Date represents the correct UTC instant; without
            // this, `new Date(naiveString)` would be interpreted against the Node process
            // timezone and store the wrong moment.
            const latestCoordinates = {
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                timestamp: req.body.timestamp,
            };

            console.log(new Date(req.body.timestamp + "+08:00"))

            await locationManagementService.pushLatestLocation(iotSerialNumber, latestCoordinates);

            res.status(201).json({
                success: true,
                message: 'PVI latest location store success',
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    getLatestLocation = async (req, res) => {
        try {
            const pviId = req.params.id;
            const result = await locationManagementService.getLatestLocation(pviId);

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
}
