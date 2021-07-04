const { TModelAttributes } = require('sequelize');

module.exports = class BandRepo {

    /**
     * BandRepo constructor
     *
     * @param repository
     */
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Get a list of Bands (supports pagination)
     *
     * @param limit - default: 50
     * @param offset - default: 0
     * @param search - default: none specified
     * @param columns - default: *
     *
     * @returns {Promise<{rows: Band[], count: number}>}
     */
    async getBands(limit = 50, offset = 0, search = '', columns = []) {
        return await this.repository.getAll(limit, offset, search, columns);
    }

    /**
     * Get a single Band by ID
     *
     * @param id
     * @param includes
     *
     * @returns {Promise<*>}
     */
    async getBandById(id, includes = []) {
        return await this.repository.getById(id, includes);
    }

    /**
     * Get a single Band by name
     *
     * @param name
     *
     * @returns {Promise<*>}
     */
    async getBandByName(name) {
        return await this.repository.getByField('name', name);
    }

    /**
     * Create a new Band
     *
     * Attributes:
     *   {
     *       session_id: <session id>,
     *       artist_id: <artist id>,
     *       genre_id: <genre id>,
     *       name: "<name>",
     *       image_url: "<image url>",
     *       day_of_week: "<day of week>",
     *       starts_at: "<time class starts>",
     *       ends_at: "<time class ends>",
     *       price: <price>,
     *       duration_weeks: <class duration in weeks>
     *   }
     *
     * @param attributes
     *
     * @returns {Promise<[User<any, TModelAttributes>, boolean]>}
     */
    async createBand(attributes) {
        return await this.repository.create(attributes);
    }

    /**
     * Update a Band
     *
     * @param id
     * @param attributes
     *
     * @returns {Promise<*>}
     */
    async updateBand(id, attributes) {
        return await this.repository.update(id, attributes);
    }

    /**
     * Delete a Band
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async deleteBand(id) {
        return await this.repository.delete(id);
    }
}