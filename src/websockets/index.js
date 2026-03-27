import http from 'http';
import { WebSocketServer } from 'ws';
import { LocationWebSocket } from './locationWebsocket.js';
import { IoTStateWebSocket } from './iotStateWebsocket.js';

let locationWebSocket;
let iotStateWebSocket;

export function createWebSocketHandler(app) {
    const server = http.createServer(app);
    const wss = new WebSocketServer({ server });

    locationWebSocket = new LocationWebSocket(wss);  
    iotStateWebSocket = new IoTStateWebSocket(wss); 

    server.listen(3000, () => {
        console.log(`WebSocket server running`);
    });
};

export function getLocationWebSocket() {
    return locationWebSocket;
};

export function getIoTStateWebSocket() {
    return iotStateWebSocket;
};