const { TModelAttributes } = require('sequelize');

module.exports = class BandInstrumentRepo {

    /**
     * BandInstrumentRepo constructor
     *
     * @param repository
     */
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Get all BandInstrument records for a Band ID
     *
     * @param band_id
     * @param includes
     *
     * @returns {Promise<*>}
     */
    async getAllBandInstrumentsForABand(band_id, includes = []) {
        return await this.repository.getAllByForeignKey('band_id', band_id, includes);
    }

    /**
     * Get a single BandInstrument by ID
     *
     * @param id
     * @param includes
     *
     * @returns {Promise<*>}
     */
    async getBandInstrumentById(id, includes = []) {
        return await this.repository.getById(id, includes);
    }

    /**
     * Create a new Band Instrument
     *
     * Attributes:
     *   {
     *       band_id: <band id>,
     *       instrument_id: <instrument id>,
     *       user_id: <user id>
     *   }
     *
     * @param attributes
     *
     * @returns {Promise<[User<any, TModelAttributes>, boolean]>}
     */
    async createBandInstrument(attributes) {
        return await this.repository.create(attributes);
    }

    /**
     * Update a Band Instrument
     *
     * @param id
     * @param attributes
     *
     * @returns {Promise<*>}
     */
    async updateBandInstrument(id, attributes) {
        return await this.repository.update(id, attributes);
    }

    /**
     * Delete a Band Instrument
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async deleteBandInstrument(id) {
        return await this.repository.delete(id);
    }
}