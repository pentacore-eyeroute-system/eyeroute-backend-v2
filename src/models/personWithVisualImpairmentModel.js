import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PVI = sequelize.define(
    'PVI',
    {   
        pvi_public_id : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        pvi_first_name : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pvi_last_name : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pvi_gender : {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'persons_with_visual_impairment',
        timestamps: true,
        paranoid: true
    }
);