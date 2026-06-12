import express from 'express';
import { NewsController } from '../controllers/newsController.js';

const router = express.Router();
const newsController = new NewsController();

// GET route
router.get('/get-all-news', newsController.getAllNews);

export default router;
