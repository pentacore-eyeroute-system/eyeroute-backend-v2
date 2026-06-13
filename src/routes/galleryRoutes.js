import express from 'express';
import { GalleryController } from '../controllers/galleryController.js';

const router = express.Router();
const galleryController = new GalleryController();

// GET route
router.get('/get-all-galleries', galleryController.getAllGalleries);

export default router;  
