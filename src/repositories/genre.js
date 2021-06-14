const { TModelAttributes } = require('sequelize');

module.exports = class GenreRepo {

    /**
     * GenreRepo constructor
     *
     * @param repository
     */
    constructor(repository) {
        this.repository = repository;
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
    async getGenres(limit = 50, offset = 0, search = '', columns = []) {
        return await this.repository.getAll(limit, offset, search, columns);
    }

    /**
     * Get a single Genre by ID
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async getGenreById(id) {
        return await this.repository.getById(id);
    }

    /**
     * Get a single Genre by name
     *
     * @param name
     *
     * @returns {Promise<*>}
     */
    async getGenreByName(name) {
        return await this.repository.getByField('name', name);
    }

    /**
     * Create a new Genre
     *
     * @param name
     *
     * @returns {Promise<[Genre<any, TModelAttributes>, boolean]>}
     */
    async createGenre(name) {
        return await this.repository.create({ name: name });
    }

    /**
     * Update a Genre
     *
     * @param id
     * @param attributes
     *
     * @returns {Promise<*>}
     */
    async updateGenre(id, attributes) {
        return await this.repository.update(id, attributes);
    }

    /**
     * Delete a Genre
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async deleteGenre(id) {
        return await this.repository.delete(id);
    }

}