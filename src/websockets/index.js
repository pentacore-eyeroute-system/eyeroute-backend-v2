import { WebSocketServer } from 'ws';
import { LocationWebSocket } from './locationWebsocket.js';
import { IoTStateWebSocket } from './iotStateWebsocket.js';
import { NotificationWebSocket } from './notificationWebsocket.js';

let locationWebSocket;
let iotStateWebSocket;
let notificationWebSocket;

export function createWebSocketHandler(server) {
    const wss = new WebSocketServer({ server });

    locationWebSocket = new LocationWebSocket(wss);  
    iotStateWebSocket = new IoTStateWebSocket(wss); 
    notificationWebSocket = new NotificationWebSocket(wss);
};

export function getLocationWebSocket() {
    return locationWebSocket;
};

export function getIoTStateWebSocket() {
    return iotStateWebSocket;
};

export function getNotificationWebSocket() {
    return notificationWebSocket;
};