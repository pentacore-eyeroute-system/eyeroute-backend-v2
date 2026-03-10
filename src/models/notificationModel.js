import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const NotificationType = sequelize.define(
    'Notification',
    {
        ntf_linked_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references : {
                model : 'family_members',
                key : 'id',
            },
        },
        ntf_linked_wearable_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references : {
                model : 'iot_wearables',
                key : 'id',
            },
        },
        ntf_linked_notification_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references : {
                model : 'notification_types',
                key : 'id',
            },
        },
        ntf_is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'notifications',
        timestamps: true,
    }
);