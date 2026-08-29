import cron from 'node-cron';
import { ActiveIoTWearableService } from '../services/activeIoTWearableService.js';
import { IoTWearableService } from '../services/ioTWearableService.js';
import { IoTStateService } from '../services/iotStateService.js'
import { TrackingRouteService } from '../services/trackingRouteService.js';

const activeWearableService = new ActiveIoTWearableService();
const iotWearableService = new IoTWearableService();
const iotStateService = new IoTStateService();
const trackingRouteService = new TrackingRouteService();

export function startIotStatusCron() {
    // Checks updatedAt column in active iot wearables table every 1 minute real-time
    cron.schedule('*/1 * * * *', async () => {
        const NOW = new Date();
        const OFFLINE_MINUTES_THRESHOLD = 2 * 60 * 1000; // 2 minutes

        // Retrieves all active iot wearables
        const activeIoTWearables = await activeWearableService.getAllActiveWearables();

        for (let i = 0; i < activeIoTWearables.length; i++) {
            const activeIoTWearable = activeIoTWearables[i];

            const lastSeenAt = new Date(activeIoTWearable.act_last_seen_at);
            let newStatus = activeIoTWearable.act_status;

            // Retrieves iot associated to current active iot wearable
            const iotWearable = await iotWearableService.findIotById(activeIoTWearable.act_linked_wearable_id);

            // Checks if lastest updatedAt timestamp is more than 2 minutes 
            if (NOW - lastSeenAt > OFFLINE_MINUTES_THRESHOLD) {
                newStatus = 'Offline';

                // Finds active tracking route
                const activeTrackingRoute = await trackingRouteService.checksActiveTracking(activeIoTWearable.id);

                if (!activeTrackingRoute) {
                    throw new Error('No active trackking route found');
                }

                const trackingData = {
                    id : activeTrackingRoute.id,
                    status : "completed"
                }

                // Ends active tracking route when iot goes offline
                await trackingRouteService.updateTrackingStatus(trackingData);
            }

            if (activeIoTWearable.act_status !== newStatus) {
                const wearableData = { 
                    status: newStatus 
                };

                // Stores new status on active iot wearables db, records transition notifications,
                // and sends new status to iot state websocket
                await iotStateService.updateBatteryLevelAndStatus(iotWearable.wearable_serial_number, wearableData);
            }
        }

        console.log('IoT Update', new Date())
    });
};