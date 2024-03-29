const { Op, TModelAttributes, Model } = require('sequelize');

module.exports = class Repository {

    /**
     * Repository constructor
     *
     * @param Model
     */
    constructor(Model) {
        this.model = Model;
    }

    /**
     * Get records for a Model
     *
     * @param limit
     * @param offset
     * @param search
     * @param columns
     *
     * @returns {Promise<{rows: Model[], count: number}>}
     */
    async getAll(limit = 50, offset = 0, search = '', columns = []) {
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

        if (typeof columns !== 'undefined' && columns.length > 0) {
            options.attributes = columns
        }

        return await this.model.findAndCountAll(options);
    }

    /**
     * Get all records for a foreign key
     *
     * @param key
     * @param id
     * @param includes
     *
     * @returns {Promise<*>}
     */
    async getAllByForeignKey(key, id, includes) {
        let options = {
            where: {
                [key]: id
            }
        };

        if (typeof includes !== 'undefined' && includes.length > 0) {
            options.include = includes;
        }

        return await this.model.findAll(options);
    }

    /**
     * Get a single Model by ID
     *
     * @param id
     * @param includes
     *
     * @returns {Promise<*>}
     */
    async getById(id, includes = []) {
        let options = {
            where: {
                id: id
            }
        };

        if (typeof includes !== 'undefined' && includes.length > 0) {
            options.include = includes;
        }

        return await this.model.findOne(options);
    }

    /**
     * Get a single Model by field name => value
     *
     * @param name
     * @param value
     *
     * @returns {Promise<*>}
     */
    async getByField(name, value) {
        return await this.model.findOne({ where : { [name]: value } });
    }

    /**
     * Create a new Model
     *
     * @param attributes Object
     *
     * @returns {Promise<[Model<any, TModelAttributes>, boolean]>}
     */
    async create(attributes) {

        return await this.model.create(attributes);
    }

    /**
     * Update a Model
     *
     * @param id
     * @param attributes
     *
     * @returns {Promise<*>}
     */
    async update(id, attributes) {
        return await this.model.update(attributes, { where : { id: id } });
    }

    /**
     * Delete a Model
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async delete(id) {
        return await this.model.destroy({ where: { id: id } });
    }
}