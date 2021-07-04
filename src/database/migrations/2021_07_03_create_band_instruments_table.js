const { Sequelize, DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('band_instruments', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        band_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        instrument_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.BIGINT
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
        queryInterface.addIndex('band_instruments', ['band_id']);
        queryInterface.addIndex('band_instruments', ['instrument_id']);
        queryInterface.addIndex('band_instruments', ['user_id']);
    });
}

async function down({ context: queryInterface }) {
    await queryInterface.dropTable('band_instruments');
}

module.exports = { up, down };