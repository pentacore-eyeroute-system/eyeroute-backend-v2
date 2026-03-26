import http from 'http';
import { WebSocketServer } from 'ws';
import { LocationWebSocket } from './locationWebsocket.js';

let locationWebSocket;

export function createWebSocketHandler(app) {
    const server = http.createServer(app);
    const wss = new WebSocketServer({ server });

    locationWebSocket = new LocationWebSocket(wss);   

    server.listen(3000, () => {
        console.log(`WebSocket server running`);
    });
};

export function getLocationWebSocket() {
    return locationWebSocket;
};