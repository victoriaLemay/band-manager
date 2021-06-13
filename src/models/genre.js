const genreInit = function (sequelize, DataTypes) {
    return sequelize.define('Genre', {
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
        modelName: 'Genre',
        tableName: 'genres',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}

module.exports = {
    genreInit
}