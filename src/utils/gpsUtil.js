export class GpsUtil {
    // Haversine formula - calculates the shortest distance between two points on the surface of a sphere, using their latitude and longitude
    calculateDistance(referencePointGps, currentGps) {
        const R = 6371000; // Earth's radius in meters

        const toRadians = degrees => degrees * (Math.PI / 180); // Converts degrees to radians

        const deltaLatitude = toRadians(referencePointGps.latitude - currentGps.latitude);
        const deltaLongtitude = toRadians(referencePointGps.longitude - currentGps.longitude);

        const a = 
                Math.sin(deltaLatitude / 2) ** 2 +
                Math.cos(toRadians(referencePointGps.latitude)) *
                Math.cos(toRadians(currentGps.latitude)) *
                Math.sin(deltaLongtitude / 2) ** 2;

        // atan2 - returns the angle (in radians) between the X axis and the line going through both the origin and the given point.
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const meters = R * c;

        return meters;
    }
}