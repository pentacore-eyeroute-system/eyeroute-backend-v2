import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Location = sequelize.define(
  'Location',
  {
    loc_linked_active_wearable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references : {
        model: 'active_iot_wearables',
        key: 'id'
      }
    },
    loc_latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false
    },
    loc_longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false
    },
    loc_recorded_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  { 
    tableName: 'locations',
    timestamps: true
  }
);