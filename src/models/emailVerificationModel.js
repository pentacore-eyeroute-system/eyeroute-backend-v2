import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const EmailVerification = sequelize.define(
    'EmailVerification',
    {   
        ver_fam_cognito_sub : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ver_fam_email : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ver_otp : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ver_expires_at : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        ver_attempts : {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ver_is_used : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: 'email_verifications',
        timestamps: true,
    }
);