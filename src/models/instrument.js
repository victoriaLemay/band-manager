const instrumentInit = function (sequelize, DataTypes) {
    return sequelize.define('Instrument', {
        id: {
            type: DataTypes.BIGINT,
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
        }
    },{
        sequelize,
        modelName: 'Instrument',
        tableName: 'instruments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}

module.exports = {
    instrumentInit
}