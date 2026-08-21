import { sequelize } from "../config/db.js";
import pkg from 'sequelize';

const { DataTypes } = pkg;

export const TrackingRoute = sequelize.define(
    'TrackingRoute',
    {
        trk_linked_active_wearable_id : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        trk_type : {
            type: DataTypes.ENUM('stationary', 'moving'),
            defaultValue: 'stationary',
            allowNull: false,
        },
        trk_status: {
            type: DataTypes.ENUM('active', 'completed'),
            defaultValue: 'active',
            allowNull: false,
        },
        trk_reference_latitude : {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: false,
        },
        trk_reference_longitude : {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: false,
        },
        trk_movement_stage : {
            type: DataTypes.INTEGER,
            allowNull: false,   
            defaultValue: 0,         
        },
        trk_accumulated_distance : {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,            
        },
        trk_stationary_observation_started_at : {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName : 'tracking_routes',
        timestamps: true, 
    }
);