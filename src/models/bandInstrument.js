const Band = require('./band')
const Instrument = require('./instrument');
const User = require('./user');
const { exists, multipleKeyUnique } = require('../validation/validators');

const bandInstrumentInit = function (sequelize, DataTypes) {
    return sequelize.define('BandInstrument', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        band_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Band,
                key: 'id'
            },
            validate: {
                async referenceExists(value) {
                    const result = await exists(sequelize, 'bands', value);
                    if(!result) {
                        throw new Error('band_id not found');
                    }
                }
            }
        },
        instrument_id: {
            type: DataTypes.BIGINT,
            references: {
                model: Instrument,
                key: 'id'
            },
            validate: {
                async referenceExists(value) {
                    const result = await exists(sequelize, 'instruments', value);
                    if(!result) {
                        throw new Error('instrument_id not found');
                    }
                },
                async instrumentNotADuplicateForBand(value) {
                    const result = await multipleKeyUnique(
                        sequelize,
                        'band_instruments',
                        'band_id',
                        this.band_id,
                        'instrument_id',
                        value);
                    if(result) {
                        throw new Error('instrument_id already exists for this band_id');
                    }
                }
            }
        },
        user_id: {
            type: DataTypes.BIGINT,
            references: {
                model: User,
                key: 'id'
            },
            validate: {
                async referenceExists(value) {
                    const result = await exists(sequelize, 'users', value);
                    if(!result) {
                        throw new Error('user_id not found');
                    }
                }
            }
        }
    },{
        sequelize,
        modelName: 'BandInstrument',
        tableName: 'band_instruments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
}

module.exports = {
    bandInstrumentInit
}