const { getDb } = require('../db');
const { DataTypes } = require('sequelize');

const { artistInit } = require('../models/artist');
const { genreInit } = require('../models/genre');
const { instrumentInit } = require('../models/instrument');

const ArtistRepo = require('../repositories/artist');
const GenreRepo = require('../repositories/genre');
const InstrumentRepo = require('../repositories/instrument');

const connection = getDb();

const artistModel = artistInit(connection, DataTypes);
const artistRepo = new ArtistRepo(connection, artistModel);

const genreModel = genreInit(connection, DataTypes);
const genreRepo = new GenreRepo(connection, genreModel);

const instrumentModel = instrumentInit(connection, DataTypes);
const instrumentRepo = new InstrumentRepo(connection, instrumentModel);

module.exports = {
    artistRepo,
    genreRepo,
    instrumentRepo
}