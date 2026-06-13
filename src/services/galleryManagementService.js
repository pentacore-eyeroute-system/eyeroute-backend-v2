import { sequelize } from '../config/db.js'
import { AwsService } from "./awsService.js";
import { GalleryService } from "./galleryService.js";
import { GalleryPictureService } from "./galleryPictureService.js";

const awsService = new AwsService();
const galleryService = new GalleryService();
const galleryPictureService = new GalleryPictureService();

export class GalleryManagementService {
    async getAllGalleries() {
        // Retrieves all galleries 
        const allGalleries = await galleryService.getAllGalleries();

        const galleriesToSend = await Promise.all(
            // Loops through all galleries
            allGalleries.map(async (gallery) => {
                const pictures = await Promise.all(
                    // Retrieves all picture path or file key associated to individual gallery
                    gallery.GalleryPictures.map(async (picture) => {
                        // Retrieves picture url from aws s3
                        const presignedUrl = await awsService.getGalleryPic(picture.gpi_pic_path);

                        return {
                            ...picture.toJSON(),
                            gpi_pic_url : presignedUrl
                        };
                    })
                )

                return {
                    ...gallery.toJSON(),
                    galleryPictures: pictures,
                }            
            })
        );

        return galleriesToSend;
    };
};