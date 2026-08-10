import express from "express";
import cors from 'cors';
import accountRoutes from './routes/accountRoutes.js'
import pviRoutes from './routes/pviRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import iotStateRoutes from './routes/iotStateRoutes.js';
import streamRoutes from './routes/streamRoutes.js';
import newsRoutes from './routes/newsRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js';
import authRoutes from './routes/authRoutes.js';
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
app.use('/api/stream', streamRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/register', authRoutes);

export default app;