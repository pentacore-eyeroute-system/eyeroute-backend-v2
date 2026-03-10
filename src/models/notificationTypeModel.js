import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const NotificationType = sequelize.define(
    'NotificationType',
    {
        ntt_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ntt_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'notification_types',
        timestamps: true,
    }
);