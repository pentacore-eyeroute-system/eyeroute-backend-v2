import { NewsManagementService} from "../services/newsManagementService.js";

const newsManagementService = new NewsManagementService();

export class NewsController {
    getAllNews = async (req, res) => {
        try {
            const result = await newsManagementService.getAllNews();

            res.status(200).json({
                success: true,
                message: 'News retrieval successful',
                result
            });    
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    };
};