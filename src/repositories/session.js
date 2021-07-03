const { TModelAttributes } = require('sequelize');

module.exports = class SessionRepo {

    /**
     * SessionRepo constructor
     *
     * @param repository
     */
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Get a list of Sessions (supports pagination)
     *
     * @param limit - default: 50
     * @param offset - default: 0
     * @param columns - default: *
     *
     * @returns {Promise<{rows: Session[], count: number}>}
     */
    async getSessions(limit = 50, offset = 0, columns = []) {
        return await this.repository.getAll(limit, offset, '', columns);
    }

    /**
     * Get a single Session by ID
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async getSessionById(id) {
        return await this.repository.getById(id);
    }

    /**
     * Create a new Session
     *
     * Attributes:
     *   {
     *       started_at: "<started_at>",
     *       showcased_at: "<showcased_at>",
     *       showcase_location: "<showcase_location>"
     *   }
     *
     * @param attributes
     *
     * @returns {Promise<[User<any, TModelAttributes>, boolean]>}
     */
    async createSession(attributes) {
        return await this.repository.create(attributes);
    }

    /**
     * Update a Session
     *
     * @param id
     * @param attributes
     *
     * @returns {Promise<*>}
     */
    async updateSession(id, attributes) {
        return await this.repository.update(id, attributes);
    }

    /**
     * Delete a Session
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async deleteSession(id) {
        return await this.repository.delete(id);
    }

}