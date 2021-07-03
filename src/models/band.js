const Session = require('./session');
const Artist = require('./artist');
const Genre = require('./genre');
const { exists } = require('../validation/validators');

const bandInit = function (sequelize, DataTypes) {
    return sequelize.define('Band', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        session_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Session,
                key: 'id'
            },
            validate: {
                async referenceExists(value) {
                    const result = await exists(sequelize, 'sessions', value);
                    if(!result) {
                        throw new Error('session_id not found');
                    }
                }
            }
        },
        artist_id: {
            type: DataTypes.BIGINT,
            references: {
                model: Artist,
                key: 'id'
            },
            validate: {
                async referenceExists(value) {
                    const result = await exists(sequelize, 'artists', value);
                    if(!result) {
                        throw new Error('artist_id not found');
                    }
                }
            }
        },
        genre_id: {
            type: DataTypes.BIGINT,
            references: {
                model: Genre,
                key: 'id'
            },
            validate: {
                async referenceExists(value) {
                    const result = await exists(sequelize, 'genres', value);
                    if(!result) {
                        throw new Error('genre_id not found');
                    }
                }
            }
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
        }
    },{
        sequelize,
        modelName: 'Band',
        tableName: 'bands',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}

module.exports = {
    bandInit
}