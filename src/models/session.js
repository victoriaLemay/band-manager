const sessionInit = function (sequelize, DataTypes) {
    return sequelize.define('Session', {
        id: {
            type: DataTypes.BIGINT,
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
        }
    },{
        sequelize,
        modelName: 'Session',
        tableName: 'sessions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}

module.exports = {
    sessionInit
}