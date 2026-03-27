import { IoTStateService } from "../services/iotStateService.js";

const iotStateService = new IoTStateService();

export class IoTStateController {  
    getBatteryLevelAndStatus = async (req, res) => {
        try {
            const pviId = req.params.id;

            const result = await iotStateService.getBatteryLevelAndStatus(pviId);

            res.status(200).json({
                success: true,
                message: 'Device battery level and status retrieval success',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };

    updateBatteryLevelAndStatus = async (req, res) => {
        try {
            const iotSerialNumber = req.params.serialNumber;
            const iotWearableData = {
                batteryLevel : req.body.batteryLevel,
                status : req.body.status,
            };

            const result = await iotStateService.updateBatteryLevelAndStatus(iotSerialNumber, iotWearableData);

            res.status(200).json({
                success: true,
                message: 'Device battery level and status update success',
            });            
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });            
        }
    };
}