import { News } from "../models/newsModel.js";
import { NewsPictures } from '../models/newsPictureModel.js';

export class NewsService {
    async getAllNews() {
        const news = await News.findAll(
            { 
                where: { news_is_temporarily_deleted: false },
                include: [
                    {
                        model: NewsPictures
                    }
                ]
            }
        );

        return news;
    };
};