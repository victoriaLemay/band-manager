const { Sequelize, DataTypes } = require('sequelize');
const instrumentSeeds = require('../seeders/instruments');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('instruments', {
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
        is_band_default: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.DATE(3),
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
        },
        updated_at: {
            type: DataTypes.DATE(3),
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)')
        }
    }).then(() => {
        queryInterface.addIndex('instruments', ['is_band_default']);
        queryInterface.bulkInsert('instruments', instrumentSeeds);
    });
}

async function down({ context: queryInterface }) {
    await queryInterface.dropTable('instruments');
}

module.exports = { up, down };