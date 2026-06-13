import { Gallery } from "../models/galleryModel.js";
import { GalleryPicture } from "../models/galleryPictureModel.js";

export class GalleryService { 
    async getAllGalleries() {
        const gallery = await Gallery.findAll(
            { 
                where: { gal_is_temporarily_deleted: false },
                include: [
                    {
                        model: GalleryPicture
                    }
                ]
            }
        );

        return gallery;
    };
};