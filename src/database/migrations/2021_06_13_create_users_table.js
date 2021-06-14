const { Sequelize, DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('users', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT
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
    });
}

async function down({ context: queryInterface }) {
    await queryInterface.dropTable('users');
}

module.exports = { up, down };