import app from "./app.js";
import config from "./config/env.js";
import { startDbConnection } from "./config/db.js";
import { createWebSocketHandler } from './websockets/index.js';
import { startIotStatusCron } from "./crons/iotStatusCron.js";

const PORT = config.port;

startDbConnection();

// Sets up WebSocket server
createWebSocketHandler(app);

// Checks iot status every 1 minute
startIotStatusCron();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});