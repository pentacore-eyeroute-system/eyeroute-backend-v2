import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ActiveIoTWearable = sequelize.define(
  'ActiveIoTWearable',
  {
    act_linked_wearable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model : 'iot_wearables',
        key : 'id',
      },
    },
    act_linked_pvi_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model : 'persons_with_visual_impairment',
        key : 'id',
      },
      onDelete: 'CASCADE',
    },
    act_battery_level: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null, // Unknown until first telemetry
    },
    act_status: {
      type: DataTypes.ENUM('offline', 'online'),
      allowNull: false,
      defaultValue: 'offline',
    },
  },
  {
    tableName: 'active_iot_wearables',
    timestamps: true,
    paranoid: true,
  }
);