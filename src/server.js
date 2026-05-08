import app from "./app.js";
import config from "./config/env.js";
import { startDbConnection } from "./config/db.js";
import { createWebSocketHandler } from './websockets/index.js';
import { startIotStatusCron } from "./crons/iotStatusCron.js";
import http from "http";

const PORT = config.port;

startDbConnection();

// Sets up WebSocket server
const server = http.createServer(app);
createWebSocketHandler(server);

// Checks iot status every 1 minute
startIotStatusCron();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});