import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Stream = sequelize.define(
    'Stream',
    {
        str_linked_active_wearable_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references : {
                model: 'active_iot_wearables',
                key: 'id'
            }
        },
        str_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'stream_urls',
        timestamps: true
    }
);