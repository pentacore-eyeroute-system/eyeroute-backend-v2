import { ActiveIoTWearableService } from "./activeIoTWearableService.js";
import { LocationService } from "./locationService.js";
import { IoTWearableService } from "./ioTWearableService.js";
import { getLocationWebSocket } from "../websockets/index.js";
import { TrackingRouteService } from "./trackingRouteService.js";
import { GpsUtil } from "../utils/gpsUtil.js";

const activeWearableService = new ActiveIoTWearableService();
const locationService = new LocationService();
const iotWearableService = new IoTWearableService();
const trackingRouteService = new TrackingRouteService();
const gpsUtil = new GpsUtil();

export class LocationManagementService {
    async pushLatestLocation(iotSerialNumber, latestCoordinates) {
        // Finds iot record based from given serial number
        const iotWearable = await iotWearableService.findIotBySerialNumber(iotSerialNumber);

        if (!iotWearable) {
            throw new Error('Device not found')
        }

        // Finds active iot record associated to iot id
        const activeWearable = await activeWearableService.findByWearableId(iotWearable.id);

        if (!activeWearable) {
            throw new Error('Device not yet activated')
        }

        // FLOW: Checks if there is active tracking (for WITHOUT destination) associated to active iot id
        const activeTrackingRoute = await trackingRouteService.checksActiveTracking(activeWearable.id);

        // OPTION A: If there's no active tracking (for WITHOUT destination)
        if (!activeTrackingRoute) {
            const trackingData = {
                activeWearableId : activeWearable.id,
                trackingType : 'stationary',
                status : 'active',
                referenceLatitude: latestCoordinates.latitude,
                referenceLongitude: latestCoordinates.longitude,
                accumulatedDistance: 0,
                movementStage: 0,
                stationaryObservationStartedAt: null,
            };
            
            // Creates new tracking route record
            const trackingRoute = await trackingRouteService.addTrackingRoute(trackingData);

            // Stores current gps coordinates with tracking route id
            await locationService.pushLatestLocation(activeWearable.id, latestCoordinates, trackingRoute.id);

            return;
        }  

        // OPTION B: If there's an active tracking (for WITHOUT destination)
        let referencePointGps = {
            latitude: activeTrackingRoute.trk_reference_latitude,
            longitude: activeTrackingRoute.trk_reference_longitude,
        };

        // Retrieves previous gps location
        const previousLocation = await locationService.getLatestTrackingRouteLocation(activeTrackingRoute.id);

        if (!previousLocation) {
            throw new Error('No previous GPS location found for tracking route');
        }

        const previousGps = {
            latitude: Number(previousLocation.loc_latitude),
            longitude: Number(previousLocation.loc_longitude),
        }

        const currentGps = {
            latitude: latestCoordinates.latitude,
            longitude: latestCoordinates.longitude,
            timestamp: latestCoordinates.timestamp,
        };

        let accumulatedDistance = Number(activeTrackingRoute.trk_accumulated_distance);

        let trackingType = activeTrackingRoute.trk_type;

        // FLOW: Checks if tracking type is stationary or moving

        // OPTION A
        if (trackingType === "stationary") {
            const MOVEMENT_THRESHOLD = 20; // 20 meters

            const distanceFromPreviousGps = gpsUtil.calculateDistance(previousGps, currentGps);            

            const distanceFromReferencePoint = gpsUtil.calculateDistance(referencePointGps, currentGps);

            // FLOW: Checks if distance from reference point is (less than or equal) to 20 meters OR greater than 20 meters

            // OPTION A: If gps location is near to reference point (less than 20m away)
            if (distanceFromReferencePoint < MOVEMENT_THRESHOLD) {
                accumulatedDistance = distanceFromReferencePoint;

                const trackingData = {
                    id : activeTrackingRoute.id,
                    accumulatedDistance: accumulatedDistance,
                    movementStage: 0
                }

                // Still stationary
                await trackingRouteService.updateAccumulatedDistance(trackingData);

                // Still stationary and previous gps isn't > 20 meters
                await trackingRouteService.updateMovementStage(trackingData);

                // Stores current gps coordinates with tracking route id
                await locationService.pushLatestLocation(activeWearable.id, latestCoordinates, activeTrackingRoute.id);
            // OPTION B: If gps location is farther from reference point by (equal to or more than 20m away)
            } else {
                // FLOW : Checks the movement stage to prevent treating noisy gps as actual position and flagging tracking route immediately as moving
                // Needs 2 consecutive gps which are > 20m from reference point to be considered as moving

                // OPTION A: If current gps is > 20m and movement stage is 0 (meaning previous gps is <= 20m)
                if (activeTrackingRoute.trk_movement_stage === 0) {
                    const trackingData = {
                        id : activeTrackingRoute.id,
                        movementStage : 1,
                    };

                    // Marks the first gps location beyond 20m
                    await trackingRouteService.updateMovementStage(trackingData);

                    // Stores current gps coordinates with tracking route id
                    await locationService.pushLatestLocation(activeWearable.id, latestCoordinates, activeTrackingRoute.id);
                // OPTION B: If current gps is > 20m and movement stage is 1 (meaning previous gps is also > 20m)
                } else if (activeTrackingRoute.trk_movement_stage === 1) {
                    const trackingData = {
                        id : activeTrackingRoute.id,
                        status : "completed",
                        accumulatedDistance: accumulatedDistance,
                        movementStage : 0,
                    };

                    // Ends active tracking route to transition to moving
                    await trackingRouteService.updateTrackingStatus(trackingData);

                    // Resets tracking movement stage for observing stationary to moving movement 
                    await trackingRouteService.updateMovementStage(trackingData);

                    const newTrackingData = {
                        activeWearableId : activeWearable.id,
                        trackingType : 'moving',
                        status : 'active',
                        referenceLatitude: previousGps.latitude,
                        referenceLongitude: previousGps.longitude,
                        accumulatedDistance: distanceFromPreviousGps, // Distance between first gps >20m and second gps >20m
                        movementStage: 0,
                        stationaryObservationStartedAt: null,
                    };

                    // Creates new tracking route record (moving)
                    const newTrackingRoute = await trackingRouteService.addTrackingRoute(newTrackingData);

                    // Reasigns first gps beyond >20m from stationary route to moving tracking route
                    await locationService.updateLocationTrackingRouteId(previousLocation.id, newTrackingRoute.id);
               
                    // Stores current gps coordinates with tracking route id
                    await locationService.pushLatestLocation(activeWearable.id, latestCoordinates, newTrackingRoute.id);
                }
            }
        // OPTION B
        } else if (trackingType === "moving") {
            // Calculates the distance between previous gps and current gps in meters
            const distance = gpsUtil.calculateDistance(previousGps, currentGps);

            accumulatedDistance += distance

            const trackingData = {
                id : activeTrackingRoute.id,
                accumulatedDistance : accumulatedDistance,
            };

            await trackingRouteService.updateAccumulatedDistance(trackingData);

            // FLOW: Observes gps location if it's 3 meters or less from previous gps to determine if it's continuously moving or transitioning to stationary

            const stationaryObservationStartedAt = activeTrackingRoute.trk_stationary_observation_started_at;
            const MOVEMENT_THRESHOLD = 3 ; // 3 meters                        

            // OPTION A: If pvi is moving >= 3 meters from previous gps/ or started moving again from temporary stop
            if (distance >= MOVEMENT_THRESHOLD) {
                const trackingData = {
                    id : activeTrackingRoute.id,
                    stationaryObservationStartedAt : null,                    
                };

                // Resets stationary observation 
                await trackingRouteService.updateStationaryObservationAt(trackingData);
            // OPTION B: If pvi is moving slowly to the point it's gps location from previous gps is less than 3 meters
            } else {
                // FLOW: Observes pvi movement by either marking time they started to be temporarily stationary or determining if they stopped fully

                // OPTION A: Records timestamp for pvi's FIRST movement (from previous gps to current gps) with less than 3 meters
                if (!stationaryObservationStartedAt) {
                    const trackingData = {
                        id : activeTrackingRoute.id,
                        stationaryObservationStartedAt : currentGps.timestamp // This observation will treat pvi as slowing down or being stationary temporarily
                    }

                    // Still moving
                    await trackingRouteService.updateStationaryObservationAt(trackingData);
                // OPTION B: If there's already a history of slowing down / pvi's SECOND movement with less than 3 meters
                } else {
                    // FLOW: Observes pvi to determine if they are stopped permanently or slowed down only

                    // Calculates time passed between current gps location's time and time pvi started to be temporarily stationary 
                    const stationaryTime = new Date(currentGps.timestamp) - new Date(stationaryObservationStartedAt);

                    // 2 minutes - common maximum time for stoplight if ever pvi stopped on a stoplight
                    // 10 seconds - additional buffer time to consider when they moved after go signal (if ever they really stopped on a stoplight)
                    const TEMPORARY_STATIONARY_THRESHOLD = (2 * 60 + 10) * 1000 

                    // OPTION A: If pvi indeed became stationary
                    if (stationaryTime >= TEMPORARY_STATIONARY_THRESHOLD) {
                        const trackingData = {
                            id : activeTrackingRoute.id,
                            status : "completed"
                        }

                        // Ends active tracking route
                        await trackingRouteService.updateTrackingStatus(trackingData);

                        return;
                    };

                    // OPTION B: If pvi moved (even for less than 3 meters) before 2 minutes and 10 seconds has passed when temporarily stopping, 
                    // tracking route type is still moving
                }
            }

            // Stores current gps coordinates with tracking route id
            await locationService.pushLatestLocation(activeWearable.id, latestCoordinates, activeTrackingRoute.id);
        }

        // Sends latest coordinates to location websocket for real-time updates
        const locationWS = getLocationWebSocket();

        if (locationWS) {
            locationWS.broadcastLocation(latestCoordinates, iotWearable.id);
        } else {
            console.error('WebSocket not initialized');
        }
    };

    async getLatestLocation(pviId) {
        // Finds active wearable linked to PVI
        const activeIoTWearable = await activeWearableService.findByPviId(pviId);

        if (!activeIoTWearable) {
            throw new Error('Device not found')
        }

        // Retrieves latest location by giving active wearable id
        const location = await locationService.getLatestLocation(activeIoTWearable.id);   

        return location;
    };
}