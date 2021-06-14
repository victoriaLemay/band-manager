const { TModelAttributes } = require('sequelize');

module.exports = class UserRepo {

    /**
     * UserRepo constructor
     *
     * @param repository
     */
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Get a list of Users (supports pagination)
     *
     * @param limit - default: 50
     * @param offset - default: 0
     * @param search - default: none specified
     * @param columns - default: *
     *
     * @returns {Promise<{rows: User[], count: number}>}
     */
    async getUsers(limit = 50, offset = 0, search = '', columns = []) {
        return await this.repository.getAll(limit, offset, search, columns);
    }

    /**
     * Get a single User by ID
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async getUserById(id) {
        return await this.repository.getById(id);
    }

    /**
     * Get a single User by UUID
     *
     * @param uuid
     *
     * @returns {Promise<*>}
     */
    async getUserByUuid(uuid) {
        return await this.repository.getByField('uuid', uuid);
    }

    /**
     * Get a single User by name
     *
     * @param name
     *
     * @returns {Promise<*>}
     */
    async getUserByName(name) {
        return await this.repository.getByField('name', name);
    }

    /**
     * Create a new User
     *
     * @param uuid
     * @param name
     * @param email
     * @param description
     *
     * @returns {Promise<[User<any, TModelAttributes>, boolean]>}
     */
    async createUser(uuid, name, email, description) {
        return await this.repository.create({ uuid: uuid, name: name, email: email, description: description });
    }

    /**
     * Update a User
     *
     * @param oldName
     * @param newName
     *
     * @returns {Promise<*>}
     */
    async updateUser(oldName, newName) {
        return await this.repository.update(oldName, newName);
    }

    /**
     * Delete a User
     *
     * @param id
     *
     * @returns {Promise<*>}
     */
    async deleteUser(id) {
        return await this.repository.delete(id);
    }

}