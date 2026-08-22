/*
    FCM: New model added for push notifications.

    Stores the Firebase Cloud Messaging registration token of every device a
    family member has signed in on, so a notification can be delivered while the
    app is backgrounded or closed (the notification websocket only reaches an app
    that is currently running and connected).

    One family member can have several rows: one per device, and a device gets a
    new token when the app is reinstalled or its data is cleared.
*/
import sequelizePkg from "sequelize";
const { DataTypes } = sequelizePkg;
import { sequelize } from "../config/db.js";

export const DeviceToken = sequelize.define(
    'DeviceToken',
    {
        dvt_linked_fam_id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'family_members',
                key: 'id',
            },
            onDelete: 'CASCADE'
        },
        /*
            The FCM registration token. Unique because the same token must never
            be registered twice: FCM may hand a token that was previously issued
            to one account over to another after a reinstall, so registering it
            again has to move it to the new owner rather than duplicate it.
        */
        dvt_token : {
            type: DataTypes.STRING(512),
            allowNull: false,
            unique: true,
        },
        /*
            'android' | 'ios'. Kept for troubleshooting delivery problems, which
            are usually platform specific (APNs vs FCM directly).
        */
        dvt_platform : {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'device_tokens',
        timestamps: true,
        paranoid: true,
    }
);
