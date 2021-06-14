const { TModelAttributes } = require('sequelize');

module.exports = class InstrumentRepo {

    /**
     * InstrumentRepo constructor
     *
     * @param repository
     */
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Get a list of Instruments (supports pagination)
     *
     * @param limit - default: 50
     * @param offset - default: 0
     * @param search - default: none specified
     * @param columns - default: *
     *
     * @returns {Promise<{rows: Instrument[], count: number}>}
     */
    async getInstruments(limit = 50, offset = 0, search = '', columns = []) {
        return await this.repository.getAll(limit, offset, search, columns);
    }

    /**
     * Get a single Instrument by ID
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async getInstrumentById(id) {
        return await this.repository.getById(id);
    }

    /**
     * Get a single Instrument by name
     *
     * @param name
     *
     * @returns {Promise<*>}
     */
    async getInstrumentByName(name) {
        return await this.repository.getByField('name', name);
    }

    /**
     * Create a new Instrument
     *
     * @param name
     *
     * @returns {Promise<[Instrument<any, TModelAttributes>, boolean]>}
     */
    async createInstrument(name) {
        return await this.repository.create({ name: name });
    }

    /**
     * Update an Instrument
     *
     * @param id
     * @param attributes
     *
     * @returns {Promise<*>}
     */
    async updateInstrument(id, attributes) {
        return await this.repository.update(id, attributes);
    }

    /**
     * Delete an Instrument
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async deleteInstrument(id) {
        return await this.repository.delete(id);
    }
}