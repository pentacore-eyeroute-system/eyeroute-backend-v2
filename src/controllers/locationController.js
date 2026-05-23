import { LocationManagementService } from "../services/locationManagementService.js";
import { normalizeIoTTimestamp } from "../utils/timestamp.js";

const locationManagementService = new LocationManagementService();

export class LocationController {
    pushLatestLocation = async (req, res) => {
        try {
            const iotSerialNumber = req.params.serialNumber;

            // Normalize ONCE, at the boundary, before either the DB write or the WS
            // broadcast can see the value. Doing this in the controller (rather than the
            // model/service) guarantees REST and WS observe the same instant — they
            // previously diverged because WS forwarded the raw IoT string while REST went
            // through Sequelize's host-TZ-dependent coercion.
            const recordedAt = normalizeIoTTimestamp(req.body.timestamp);

            // Temporary observation log: prints raw wire input alongside the canonical UTC
            // instant the rest of the pipeline will use. Remove after one production cycle.
            console.log(
                '[IoT-IN] raw=', JSON.stringify(req.body.timestamp),
                'typeof=', typeof req.body.timestamp,
                'normalized=', recordedAt.toISOString(),
                'now=', new Date().toISOString()
            );

            const latestCoordinates = {
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                timestamp : new Date(req.body.timestamp + "+08:00")
            };

            await locationManagementService.pushLatestLocation(iotSerialNumber, latestCoordinates);

            res.status(201).json({
                success: true,
                message: 'PVI latest location store success',
            });
        } catch (err) {
            console.error('[IoT-IN] error:', err.message);
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    };

    getLatestLocation = async (req, res) => {
        try {
            const pviId = req.params.id;
            const result = await locationManagementService.getLatestLocation(pviId);

            // Log the *wire* form (what JSON.stringify will actually send), not Date's
            // default toString which is server-local and obscured the bug in past triages.
            const wireTimestamp = result?.loc_recorded_at instanceof Date
                ? result.loc_recorded_at.toISOString()
                : result?.loc_recorded_at;
            console.log(
                '[REST-OUT] loc_recorded_at wire=', wireTimestamp,
                'now=', new Date().toISOString()
            );

            res.status(200).json({
                success: true,
                message: 'PVI latest location retrieval success',
                result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    };
}
