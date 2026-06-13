import { GalleryManagementService } from "../services/galleryManagementService.js";

const galleryManagementService = new GalleryManagementService();

export class GalleryController { 
    getAllGalleries = async (req, res) => {
        try {
            const result = await galleryManagementService.getAllGalleries();

            res.status(200).json({
                success: true,
                message: 'Gallery retrieval successful',
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