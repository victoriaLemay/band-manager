const { DataTypes, Model } = require('sequelize');
const { getDb } = require('../db');

const sequelize = getDb();

class Artist extends Model {}

Artist.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(256),
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Artist',
    tableName: 'artists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})