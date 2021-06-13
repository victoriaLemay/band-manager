const { Op, TModelAttributes } = require('sequelize');

module.exports = class GenreRepo {

    /**
     * GenreRepo constructor
     *
     * @param sequelize
     * @param GenreModel
     */
    constructor(sequelize, GenreModel) {
        this.sequelize = sequelize;
        this.genreModel = GenreModel;
    }

    /**
     * Get a list of Genres (supports pagination)
     *
     * @param limit - default: 50
     * @param offset - default: 0
     * @param search - default: none specified
     * @param columns - default: *
     *
     * @returns {Promise<{rows: Genre[], count: number}>}
     */
    async getGenres(limit = 50, offset = 0, search = '', columns = ['*']) {
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

        return await this.genreModel.findAndCountAll(options);
    }

    /**
     * Get a single Genre by ID
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async getGenreById(id) {
        return await this.genreModel.findByPk(id);
    }

    /**
     * Get a single Genre by name
     *
     * @param name
     *
     * @returns {Promise<*>}
     */
    async getGenreByName(name) {
        return await this.genreModel.findOne({ where : { name: name } });
    }

    /**
     * Create a new Genre
     *
     * @param name
     *
     * @returns {Promise<[Genre<any, TModelAttributes>, boolean]>}
     */
    async createGenre(name) {
        return await this.genreModel.findOrCreate({ where: { name: name } });
    }

    /**
     * Update a Genre
     *
     * @param oldName
     * @param newName
     *
     * @returns {Promise<*>}
     */
    async updateGenre(oldName, newName) {
        return await this.genreModel.update({ name: newName }, { where : { name: oldName }});
    }

    /**
     * Delete a Genre
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async deleteGenre(id) {
        return await this.genreModel.destroy({ where: { id: id }});
    }

}