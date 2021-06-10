const artistInit = function (sequelize, DataTypes) {
    return sequelize.define('Artist', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true
        }
    },{
        sequelize,
        modelName: 'Artist',
        tableName: 'artists',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}

module.exports = {
    artistInit
}