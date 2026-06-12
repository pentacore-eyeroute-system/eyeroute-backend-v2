import { sequelize } from "../config/db.js";
import { AwsService } from "./awsService.js";
import { NewsService } from "./newsService.js";
import { NewsPicturesService } from "./newsPicturesService.js";

const awsService = new AwsService();
const newsService = new NewsService(); 
const newsPicturesService = new NewsPicturesService();

export class NewsManagementService {
    async getAllNews() {
        // Retrieves all news
        const allNews = await newsService.getAllNews();

        const newsToSend = await Promise.all(
            // Loops through all news
            allNews.map(async (news) => {
                const pictures = await Promise.all(
                    // Retrieves all picture path or file key associated to individual news
                    news.NewsPictures.map(async (picture) => {
                        // Retrieves picture url from aws s3
                        const presignedUrl = await awsService.getNewsPic(picture.npi_pic_path);

                        return {
                            ...picture.toJSON(),
                            npi_pic_url : presignedUrl,
                        }
                    })
                )

                return {
                    ...news.toJSON(),
                    newsPictures: pictures,
                }
            })
        );

        return newsToSend;
    };
};