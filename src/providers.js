const { getDb } = require('./db');
const { DataTypes } = require('sequelize');

const { artistInit } = require('./models/artist');
const { genreInit } = require('./models/genre');
const { instrumentInit } = require('./models/instrument');
const { userInit } = require('./models/user');

const ArtistRepo = require('./repositories/artist');
const GenreRepo = require('./repositories/genre');
const InstrumentRepo = require('./repositories/instrument');
const UserRepo = require('./repositories/user');

const connection = getDb();

const Repository = require('./repositories/repository');

const artistModel = artistInit(connection, DataTypes);
const artistRepo = new ArtistRepo(new Repository(artistModel));

const genreModel = genreInit(connection, DataTypes);
const genreRepo = new GenreRepo(new Repository(genreModel));

const instrumentModel = instrumentInit(connection, DataTypes);
const instrumentRepo = new InstrumentRepo(new Repository(instrumentModel));

const userModel = userInit(connection, DataTypes);
const userRepo = new UserRepo(new Repository(userModel));

module.exports = {
    artistRepo,
    genreRepo,
    instrumentRepo,
    userRepo
}