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
}