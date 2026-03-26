import { LocationManagementService } from "../services/locationManagementService.js";

const locationManagementService = new LocationManagementService();

export class LocationController {
    pushLatestLocation = async (req, res) => {
        try {
            const iotSerialNumber = req.params.serialNumber;
            const latestCoordinates = {
                latitude : req.body.latitude,
                longitude : req.body.longitude,
                timestamp : req.body.timestamp,
            };

            // Stores latest coordinates in db
            await locationManagementService.pushLatestLocation(iotSerialNumber, latestCoordinates);     
            
            res.status(201).json({
                success : true,
                message : 'PVI latest location store success',
            });
        } catch (err) {
            res.status(500).json({
                success : false,
                error : err.message
            });            
        }
    };

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