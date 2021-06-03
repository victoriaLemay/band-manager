const { getDb } = require('../db');
const { DataTypes } = require('sequelize');

const { artistInit } = require('../models/artist');
const ArtistRepo = require('../repositories/artist');

const connection = getDb();

const artistModel = artistInit(connection, DataTypes);
const artistRepo = new ArtistRepo(connection, artistModel);

module.exports = {
    artistRepo
}