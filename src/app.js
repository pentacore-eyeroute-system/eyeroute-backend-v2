import express from "express";
import cors from 'cors';
import accountRoutes from './routes/accountRoutes.js'
import pviRoutes from './routes/pviRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './models/index.js';  // Imports all models

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/pvi', pviRoutes);

export default app;