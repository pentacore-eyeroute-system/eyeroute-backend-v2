import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const IoTWearable = sequelize.define(
  'IoTWearable',
  {
    wearable_serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    wearable_activation_code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wearable_activated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    tableName: 'iot_wearables',
    timestamps: true,
  }
);