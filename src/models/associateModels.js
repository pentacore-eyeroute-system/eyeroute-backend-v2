import { FamilyPviLink } from "./familyPviLinkModel.js";
import { FamilyMember } from "./familyMemberModel.js";
import { PVI } from "./personWithVisualImpairmentModel.js";
import { IoTWearable } from "./iotWearableModel.js";
import { ActiveIoTWearable } from "./activeIoTWearableModel.js";
import { Notification } from "./notificationModel.js";
import { Location } from "./locationModel.js";
import { NotificationType } from "./notificationTypeModel.js";
import { News } from "./newsModel.js";
import { NewsPictures } from "./newsPictureModel.js";
import { Gallery } from "./galleryModel.js";
import { GalleryPicture } from "./galleryPictureModel.js";
import { NavigationRoute } from "./navigationRouteModel.js";

FamilyMember.hasMany(FamilyPviLink, {
    foreignKey: 'relative_linked_fam_id',
});

FamilyPviLink.belongsTo(FamilyMember, {
    foreignKey: 'relative_linked_fam_id',
});

PVI.hasMany(FamilyPviLink, {
    foreignKey: 'relative_linked_pvi_id',
});

FamilyPviLink.belongsTo(PVI, {
    foreignKey: 'relative_linked_pvi_id',
});

IoTWearable.hasOne(ActiveIoTWearable, {
    foreignKey : 'act_linked_wearable_id',
});

ActiveIoTWearable.belongsTo(IoTWearable, {
    foreignKey : 'act_linked_wearable_id',
});

PVI.hasOne(ActiveIoTWearable, {
    foreignKey : 'act_linked_pvi_id',
});

ActiveIoTWearable.belongsTo(PVI, {
    foreignKey : 'act_linked_pvi_id',
});

ActiveIoTWearable.hasMany(Notification, {
    foreignKey: 'ntf_linked_active_wearable_id',
});

Notification.belongsTo(ActiveIoTWearable, {
    foreignKey : 'ntf_linked_active_wearable_id',
});

ActiveIoTWearable.hasMany(Location, {
    foreignKey : 'loc_linked_active_wearable_id'
});

Location.belongsTo(ActiveIoTWearable, {
    foreignKey : 'loc_linked_active_wearable_id'
});

NotificationType.hasMany(Notification, {
    foreignKey: 'ntf_linked_notification_type_id',
});

Notification.belongsTo(NotificationType, {
    foreignKey: 'ntf_linked_notification_type_id',
});

News.hasMany(NewsPictures, {
    foreignKey: 'npi_linked_news_id',
});

NewsPictures.belongsTo(News, {
    foreignKey: 'npi_linked_news_id',
});

Gallery.hasMany(GalleryPicture, {
    foreignKey: 'gpi_linked_gallery_id',
});

GalleryPicture.belongsTo(Gallery, {
    foreignKey: 'gpi_linked_gallery_id',
});

NavigationRoute.hasMany(Location, {
    foreignKey: 'loc_linked_navigation_route_id',
});

Location.belongsTo(Location, {
    foreignKey: 'loc_linked_navigation_route_id',
});