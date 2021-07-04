const { getDb } = require('./database/db');
const { DataTypes } = require('sequelize');

const { artistInit } = require('./models/artist');
const { bandInit } = require('./models/band');
const { bandInstrumentInit } = require('./models/bandInstrument');
const { genreInit } = require('./models/genre');
const { instrumentInit } = require('./models/instrument');
const { userInit } = require('./models/user');
const { sessionInit } = require('./models/session');

const ArtistRepo = require('./repositories/artist');
const BandRepo = require('./repositories/band');
const BandInstrumentRepo = require('./repositories/bandInstrument');
const GenreRepo = require('./repositories/genre');
const InstrumentRepo = require('./repositories/instrument');
const UserRepo = require('./repositories/user');
const SessionRepo = require('./repositories/session');

const connection = getDb();

const Repository = require('./repositories/repository');

// Models and Relationships

const artistModel = artistInit(connection, DataTypes);
const bandModel = bandInit(connection, DataTypes);
const bandInstrumentModel = bandInstrumentInit(connection, DataTypes);
const genreModel = genreInit(connection, DataTypes);
const instrumentModel = instrumentInit(connection, DataTypes);
const sessionModel = sessionInit(connection, DataTypes);
const userModel = userInit(connection, DataTypes);

bandModel.belongsTo(sessionModel, { foreignKey: 'session_id' });
bandModel.belongsTo(artistModel, { foreignKey: 'artist_id' });
bandModel.belongsTo(genreModel, { foreignKey: 'genre_id' });

bandInstrumentModel.belongsTo(bandModel, { foreignKey: 'band_id' });
bandInstrumentModel.belongsTo(instrumentModel, { foreignKey: 'instrument_id' });
bandInstrumentModel.belongsTo(userModel, { foreignKey: 'user_id' });

// Repositories

const artistRepo = new ArtistRepo(new Repository(artistModel));
const bandRepo = new BandRepo(new Repository(bandModel));
const bandInstrumentRepo = new BandInstrumentRepo(new Repository(bandInstrumentModel));
const genreRepo = new GenreRepo(new Repository(genreModel));
const instrumentRepo = new InstrumentRepo(new Repository(instrumentModel));
const sessionRepo = new SessionRepo(new Repository(sessionModel));
const userRepo = new UserRepo(new Repository(userModel));

module.exports = {
    artistRepo,
    bandRepo,
    bandInstrumentRepo,
    genreRepo,
    instrumentRepo,
    userRepo,
    sessionRepo
}