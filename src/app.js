import express from "express";
import cors from 'cors';
import accountRoutes from './routes/accountRoutes.js'
import pviRoutes from './routes/pviRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import iotStateRoutes from './routes/iotStateRoutes.js';
import './models/index.js';  // Imports all models

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/account', accountRoutes);
app.use('/api/pvi', pviRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/iot', iotStateRoutes);

export default app;