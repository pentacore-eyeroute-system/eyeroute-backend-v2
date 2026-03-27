import WebSocket from "ws";

export class IoTStateWebSocket {
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

    broadcastIotState(iotWearableData, iotWearableId) {
        const result = {
            iot_battery_level : iotWearableData.batteryLevel,
            iot_status : iotWearableData.status,
        };

        const latestIotState = JSON.stringify({
            success : true,
            message : 'Device battery level and status retrieval success',
            result
        });

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN &&
                client.iotWearableId === iotWearableId
            ) {
                client.send(latestIotState);
                console.log('Broadcasting to iot wearable id wearable:', iotWearableId);
            }
        });
    };
}