const { Sequelize, DataTypes } = require('sequelize');

async function up({ context: queryInterface }) {
    await queryInterface.createTable('bands', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        session_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        artist_id: {
            type: DataTypes.BIGINT
        },
        genre_id: {
            type: DataTypes.BIGINT
        },
        name: {
            type: DataTypes.STRING(256)
        },
        image_url: {
            type: DataTypes.STRING(256)
        },
        day_of_week: {
            type: DataTypes.ENUM,
            values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        starts_at: {
            type: DataTypes.TIME
        },
        ends_at: {
            type: DataTypes.TIME
        },
        price: {
            type: DataTypes.DECIMAL(6,2)
        },
        duration_weeks: {
            type: DataTypes.INTEGER
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
        queryInterface.addIndex('bands', ['session_id']);
        queryInterface.addIndex('bands', ['artist_id']);
        queryInterface.addIndex('bands', ['genre_id']);
        queryInterface.addIndex('bands', ['name']);
    });
}

async function down({ context: queryInterface }) {
    await queryInterface.dropTable('bands');
}

module.exports = { up, down };