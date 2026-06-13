import sequelizePkg from "sequelize";
const { DataTypes } = sequelizePkg;
import { sequelize } from "../config/db.js";

export const FamilyMember = sequelize.define(
    'FamilyMember',
    {   
        fam_cognito_sub : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        fam_first_name : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fam_last_name : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fam_gender : {
            type: DataTypes.ENUM('Female', 'Male', 'Prefer Not to Say'),
            defaultValue: 'Prefer Not to Say',
            allowNull: false,
        },
        fam_profile_pic_path : {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'family_members',
        timestamps: true,
        paranoid: true
    }
);