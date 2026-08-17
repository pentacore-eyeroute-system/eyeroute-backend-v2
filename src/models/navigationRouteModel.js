import { sequelize } from "../config/db.js";
import pkg from 'sequelize';

const { DataTypes } = pkg;

export const NavigationRoute = sequelize.define(
    'NavigationRoute',
    {
        nav_linked_active_wearable_id : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        nav_destination_name : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nav_status: {
            type: DataTypes.ENUM('active', 'completed', 'overriden'),
            defaultValue: 'active',
            allowNull: false,
        },
        nav_cancelled_at : {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName : 'navigation_routes',
        timestamps: true, 
    }
);