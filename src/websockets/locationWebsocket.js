import WebSocket from "ws";

export class LocationWebSocket {
    constructor(wss) {
        this.wss = wss;
        this.setupConnection();
    }

    setupConnection() {
        this.wss.on('connection', (ws) => {
            console.log('Client Connected');

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);

                    if (!data.iotWearableId) {
                        console.error('iotWearableId missing in message');
                        return;
                    }

                    ws.iotWearableId = data.iotWearableId;
                    console.log('Subscribed to iot wearable id:', ws.iotWearableId);
                } catch (err) {
                    console.error('Location WebSocket Error:', err.message);
                }
            });

            ws.on('close', () => {
                console.log('Client Disconnected');
            });
        });
    };

    broadcastLocation(latestCoordinates, iotWearableId) {
        const result = {
            loc_latitude : latestCoordinates.latitude,
            loc_longitude : latestCoordinates.longitude,
            loc_recorded_at : latestCoordinates.timestamp,                    
        };

        const latestLocation = JSON.stringify({
            success : true,
            message : 'PVI latest location retrieval success',
            result
        });

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && 
                client.iotWearableId === iotWearableId
            ) {
                client.send(latestLocation);
                console.log('Broadcasting to iot wearable id wearable:', iotWearableId);
            }
        });
    };
}