const { Sequelize, DataTypes } = require('sequelize');
const artistSeeds = require('../seeders/artists');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('artists', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)')
        }
    }).then(() => {
        queryInterface.bulkInsert('artists', artistSeeds);
    });
}

async function down({ context: queryInterface }) {
    await queryInterface.dropTable('artists');
}

module.exports = { up, down };