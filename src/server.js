import app from "./app.js";
import config from "./config/env.js";
import { startDbConnection } from "./config/db.js";
import { createWebSocketHandler } from './websockets/index.js';

const PORT = config.port;

startDbConnection();

// Sets up WebSocket server
createWebSocketHandler(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});