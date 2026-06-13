import { GalleryPicture } from "../models/galleryPictureModel.js";

export class GalleryPictureService { 
    async getAllPicturesByGallery(linkedGalleryId, transaction) {
        const galleryPictures = await GalleryPicture.findAll({ where: { gpi_linked_gallery_id : linkedGalleryId }, transaction });

        return galleryPictures;
    };
};