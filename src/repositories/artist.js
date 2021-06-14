const { TModelAttributes } = require('sequelize');

module.exports = class ArtistRepo {

    /**
     * ArtistRepo constructor
     *
     * @param repository
     */
    constructor(repository) {
        this.repository = repository;
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
    async getArtists(limit = 50, offset = 0, search = '', columns = []) {
        return await this.repository.getAll(limit, offset, search, columns);
    }

    /**
     * Get a single Artist by ID
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async getArtistById(id) {
        return await this.repository.getById(id);
    }

    /**
     * Get a single Artist by name
     *
     * @param name
     *
     * @returns {Promise<*>}
     */
    async getArtistByName(name) {
        return await this.repository.getByField('name', name);
    }

    /**
     * Create a new Artist
     *
     * @param name
     *
     * @returns {Promise<[Artist<any, TModelAttributes>, boolean]>}
     */
    async createArtist(name) {
        return await this.repository.create({ name: name });
    }

    /**
     * Update an Artist
     *
     * @param id
     * @param attributes
     *
     * @returns {Promise<*>}
     */
    async updateArtist(id, attributes) {
        return await this.repository.update(id, attributes);
    }

    /**
     * Delete an Artist
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async deleteArtist(id) {
        return await this.repository.delete(id);
    }

}