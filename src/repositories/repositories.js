const { getDb } = require('../db');
const { DataTypes } = require('sequelize');

const { artistInit } = require('../models/artist');
const { genreInit } = require('../models/genre');

const ArtistRepo = require('../repositories/artist');
const GenreRepo = require('../repositories/genre');

const connection = getDb();

const artistModel = artistInit(connection, DataTypes);
const artistRepo = new ArtistRepo(connection, artistModel);

const genreModel = genreInit(connection, DataTypes);
const genreRepo = new GenreRepo(connection, genreModel);

module.exports = {
    artistRepo,
    genreRepo
}