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
            allowNull: false
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
        queryInterface.bulkInsert('instruments', instrumentSeeds);
    });
}

async function down({ context: queryInterface }) {
    await queryInterface.dropTable('instruments');
}

module.exports = { up, down };