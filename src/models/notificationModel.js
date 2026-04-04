import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Notification = sequelize.define(
    'Notification',
    {
        ntf_linked_active_wearable_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references : {
                model : 'active_iot_wearables',
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
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: 'notifications',
        timestamps: true,
    }
);