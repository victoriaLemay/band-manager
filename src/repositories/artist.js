const { Op, TModelAttributes } = require('sequelize');

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
     * @param limit - default: 50
     * @param offset - default: 0
     * @param search - default: none specified
     * @param columns - default: *
     *
     * @returns {Promise<{rows: Artist[], count: number}>}
     */
    async getArtists(limit = 50, offset = 0, search = '', columns = ['*']) {
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

    /**
     * Get a single Artist by ID
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async getArtistById(id) {
        return await this.artistModel.findByPk(id);
    }

    /**
     * Get a single Artist by name
     *
     * @param name
     *
     * @returns {Promise<*>}
     */
    async getArtistByName(name) {
        return await this.artistModel.findOne({ where : { name: name } });
    }

    /**
     * Create a new Artist
     *
     * @param name
     *
     * @returns {Promise<[Artist<any, TModelAttributes>, boolean]>}
     */
    async createArtist(name) {
        return await this.artistModel.findOrCreate({ where: { name: name } });
    }

    /**
     * Update an Artist
     *
     * @param oldName
     * @param newName
     *
     * @returns {Promise<*>}
     */
    async updateArtist(oldName, newName) {
        return await this.artistModel.update({ name: newName }, { where : { name: oldName }});
    }

    /**
     * Delete an Artist
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async deleteArtist(id) {
        return await this.artistModel.destroy({ where: { id: id }});
    }

}