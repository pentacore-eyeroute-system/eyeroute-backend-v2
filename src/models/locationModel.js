export class Location {
  constructor({ id, linkedWearableId, latitude, longitude, timestamp }) {
    this.locationId = id;           
    this.locationLinkedWearableId = linkedWearableId;
    this.locationLatitude = latitude;
    this.locationLongitude = longitude;
    this.locationTimestamp = timestamp;
  }
}