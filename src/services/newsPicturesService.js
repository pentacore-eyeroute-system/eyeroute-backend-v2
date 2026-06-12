import { NewsPictures } from "../models/newsPictureModel.js";

export class NewsPicturesService {
    async getAllPicturesByNews(linkedNewsId, transaction) {
        const newsPictures = await NewsPictures.findAll({ where: { npi_linked_news_id : linkedNewsId }, transaction });

        return newsPictures;
    };
};