import { StreamManagementService } from "../services/streamManagementService.js";

const streamManagementService = new StreamManagementService();

export class StreamController {
    recordStreamUrl = async (req, res) => {
        try {
            const iotSerialNumber = req.params.serialNumber;
            const streamUrl = req.body.streamUrl;

            const result = await streamManagementService.recordStreamUrl(iotSerialNumber, streamUrl);

            res.status(201).json({
                success : true,
                message : 'Stream Url store success',
            });
        } catch (err) {
            res.status(500).json({
                success : false,
                error : err.message,
            });
        }
    }
}