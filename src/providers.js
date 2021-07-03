const { getDb } = require('./database/db');
const { DataTypes } = require('sequelize');

const { artistInit } = require('./models/artist');
const { bandInit } = require('./models/band');
const { genreInit } = require('./models/genre');
const { instrumentInit } = require('./models/instrument');
const { userInit } = require('./models/user');
const { sessionInit } = require('./models/session');

const ArtistRepo = require('./repositories/artist');
const BandRepo = require('./repositories/band');
const GenreRepo = require('./repositories/genre');
const InstrumentRepo = require('./repositories/instrument');
const UserRepo = require('./repositories/user');
const SessionRepo = require('./repositories/session');

const connection = getDb();

const Repository = require('./repositories/repository');

// Models and Relationships

const artistModel = artistInit(connection, DataTypes);
const bandModel = bandInit(connection, DataTypes);
const genreModel = genreInit(connection, DataTypes);
const instrumentModel = instrumentInit(connection, DataTypes);
const sessionModel = sessionInit(connection, DataTypes);
const userModel = userInit(connection, DataTypes);

// Repositories

const artistRepo = new ArtistRepo(new Repository(artistModel));
const bandRepo = new BandRepo(new Repository(bandModel));
const genreRepo = new GenreRepo(new Repository(genreModel));
const instrumentRepo = new InstrumentRepo(new Repository(instrumentModel));
const sessionRepo = new SessionRepo(new Repository(sessionModel));
const userRepo = new UserRepo(new Repository(userModel));

module.exports = {
    artistRepo,
    bandRepo,
    genreRepo,
    instrumentRepo,
    userRepo,
    sessionRepo
}