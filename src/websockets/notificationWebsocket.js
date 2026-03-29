import WebSocket from "ws";

export class NotificationWebSocket {
    constructor(wss) {
        this.wss = wss;
        this.setupConnection();
    };

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
                    console.error('Iot State WebSocket Error:', err.message);
                }
            });

            ws.on('close', () => {
                console.log('Client Disconnected');
            });
        });
    };

    broadcastNotification(notificationData, iotWearableId) {
        const latestNotification = JSON.stringify({
            success : true,
            message : 'Latest notification retrieval success',
            result : notificationData,
        });

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN &&
                client.iotWearableId === iotWearableId
            ) {
                client.send(latestNotification);
                console.log('Broadcasting to iot wearable id wearable:', iotWearableId);
            }
        });
    };
}