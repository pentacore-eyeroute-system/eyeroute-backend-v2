import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const FamilyPviLink = sequelize.define(
    'FamilyPviLink',
    {   
        relative_linked_fam_id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'family_members',
                key: 'id',
            },
            onDelete: 'CASCADE'
        },
        relative_linked_pvi_id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'persons_with_visual_impairment',
                key: 'id',
            },
            onDelete: 'CASCADE'
        },
        relative_relationship : {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'family_pvi_links',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['relative_linked_fam_id', 'relative_linked_pvi_id'],
            }
        ],
    }
);