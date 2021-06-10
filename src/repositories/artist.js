const { Op } = require('sequelize');

module.exports = class ArtistRepo {

    /**
     * ArtistRepo constructor
     *
     * @param sequelize
     * @param ArtistModel
     */
    constructor(sequelize, ArtistModel) {
        this.sequelize = sequelize;
        this.artistModel = ArtistModel;
    }

    /**
     * Get a list of Artists (supports pagination)
     *
     * @param limit
     * @param offset
     * @param search
     * @param columns
     *
     * @returns {Promise<{rows: Artist[], count: number}>}
     */
    async getArtists(limit = 50, offset = 0, search = '', columns = []) {
        let options = {
            limit: limit,
            offset: offset
        };

        if (search) {
            options.where = {
                name: {
                    [Op.like]: search
                }
            };
        }

        if (columns) {
            options.attributes = columns
        }

        return await this.artistModel.findAndCountAll(options);
    }

    async getArtistById(id) {
        // TODO
    }

    async getArtistByName(name) {
        // TODO
    }

    /**
     * Create a new Artist
     *
     * @param name
     *
     * @returns {Promise<*>}
     */
    async createNewArtist(name) {
        return await this.artistModel.create({name: name});
    }

}