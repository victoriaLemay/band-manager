const { Sequelize, DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('sessions', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        started_at: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        showcased_at: {
            type: DataTypes.DATE(3),
            allowNull: false
        },
        showcase_location: {
            type: DataTypes.STRING(512)
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
        queryInterface.addIndex('sessions', ['showcase_location']);
    });
}

async function down({ context: queryInterface }) {
    await queryInterface.dropTable('sessions');
}

module.exports = { up, down };