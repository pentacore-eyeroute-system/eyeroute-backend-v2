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
        // Previously this method forwarded `latestCoordinates.timestamp` verbatim — the
        // raw IoT body. That made WS payloads timezone-ambiguous and they could disagree
        // with the REST response for the same record (REST went through Sequelize, WS did
        // not). The controller now guarantees `latestCoordinates.timestamp` is a Date, but
        // we coerce defensively in case a future caller bypasses the controller.
        const recordedAt = latestCoordinates.timestamp instanceof Date
            ? latestCoordinates.timestamp
            : new Date(latestCoordinates.timestamp);

        // Serialize as ISO-8601 with the explicit 'Z' suffix. This is what Express's
        // JSON.stringify already produces for REST responses, so REST and WS now emit
        // byte-identical timestamp formats and the Flutter parser sees a single shape.
        const result = {
            loc_latitude: latestCoordinates.latitude,
            loc_longitude: latestCoordinates.longitude,
            loc_recorded_at: recordedAt.toISOString(),
        };

        console.log('[WS-OUT] loc_recorded_at wire=', result.loc_recorded_at);

        const latestLocation = JSON.stringify({
            success: true,
            message: 'PVI latest location retrieval success',
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
