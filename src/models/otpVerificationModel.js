import { sequelize } from '../config/db.js';
import pkg from "sequelize";

const { DataTypes } = pkg;

export const OtpVerification = sequelize.define(
    'OtpVerification',
    {
        ovr_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ovr_hashed_otp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ovr_expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        ovr_is_used: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        ovr_attempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ovr_blocked_until: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
    },
    {
        tableName: 'otp_verification',
        timestamps: true
    }
);