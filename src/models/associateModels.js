import { FamilyPviLink } from "./familyPviLinkModel.js";
import { FamilyMember } from "./familyMemberModel.js";
import { PVI } from "./personWithVisualImpairmentModel.js";
import { IoTWearable } from "./iotWearableModel.js";
import { ActiveIoTWearable } from "./activeIoTWearableModel.js";
import { Notification } from "./notificationModel.js";
import { Location } from "./locationModel.js";

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

PVI.hasMany(Notification, {
    foreignKey: 'ntf_linked_pvi_id',
});

Notification.belongsTo(PVI, {
    foreignKey : 'ntf_linked_pvi_id',
});

ActiveIoTWearable.hasMany(Location, {
    foreignKey : 'loc_linked_active_wearable_id'
});

Location.belongsTo(ActiveIoTWearable, {
    foreignKey : 'loc_linked_active_wearable_id'
});