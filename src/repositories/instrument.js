const { Op, TModelAttributes } = require('sequelize');

module.exports = class InstrumentRepo {

    /**
     * InstrumentRepo constructor
     *
     * @param sequelize
     * @param InstrumentModel
     */
    constructor(sequelize, InstrumentModel) {
        this.sequelize = sequelize;
        this.instrumentModel = InstrumentModel;
    }

    /**
     * Get a list of Instruments (supports pagination)
     *
     * @param limit - default: 50
     * @param offset - default: 0
     * @param search - default: none specified
     * @param columns - default: *
     *
     * @returns {Promise<{rows: Artist[], count: number}>}
     */
    async getInstruments(limit = 50, offset = 0, search = '', columns = ['*']) {
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

        return await this.instrumentModel.findAndCountAll(options);
    }

    /**
     * Get a single Instrument by ID
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async getInstrumentById(id) {
        return await this.instrumentModel.findByPk(id);
    }

    /**
     * Get a single Instrument by name
     *
     * @param name
     *
     * @returns {Promise<*>}
     */
    async getInstrumentByName(name) {
        return await this.instrumentModel.findOne({ where : { name: name } });
    }

    /**
     * Create a new Instrument
     *
     * @param name
     *
     * @returns {Promise<[Instrument<any, TModelAttributes>, boolean]>}
     */
    async createInstrument(name) {
        return await this.instrumentModel.findOrCreate({ where: { name: name } });
    }

    /**
     * Update an Instrument
     *
     * @param oldName
     * @param newName
     *
     * @returns {Promise<*>}
     */
    async updateInstrument(oldName, newName) {
        return await this.instrumentModel.update({ name: newName }, { where : { name: oldName }});
    }

    /**
     * Delete an Instrument
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async deleteInstrument(id) {
        return await this.instrumentModel.destroy({ where: { id: id }});
    }
}