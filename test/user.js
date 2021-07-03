require('chai').should();
const expect = require('chai').expect;
const { QueryTypes } = require('sequelize');

const { getDb } = require('../src/database/db');

let repositories;
let sequelize;

describe('User Tests', function() {
    before(() => {
        sequelize = getDb();
        repositories = require('../src/providers');
    });

    after(function () {
        console.log('User Tests Complete');
    });

    describe('User Repo Tests', function () {
        it('getUsers() should only return the number of results specified in the limit', async function() {
            const limit = 2;
            const userCount = await sequelize.query("SELECT COUNT(0) as total FROM users;", { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.userRepo.getUsers(limit);
            count.should.be.a('number');
            count.should.equal(userCount[0].total);

            const records = rows.map(result => result.getDataValue('name'));
            records.length.should.equal(limit);
        });

        it('getUsers() should apply a WHERE clause according to the specified search criteria', async function() {
            const search = '%1';
            const searchCount = await sequelize.query(`SELECT COUNT(0) as total FROM users WHERE name LIKE '${search}' LIMIT 0, 50`,
                { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.userRepo.getUsers(50, 0, search);
            const records = rows.map(result => result.getDataValue('name'));
            records.length.should.equal(searchCount[0].total);
        });

        it('getUsers() should only return data for the specified columns', async function() {
            const columns = ['name'];

            const { count, rows } = await repositories.userRepo.getUsers(50, 0, '', columns);
            rows[0].getDataValue('name').should.be.a('string');
            try {
                rows[0].getDataValue('id');
            } catch (err) {
                err.should.be.an('TypeError');
            }
        });

        it('getUserById() should return a single user for a valid specified ID', async function() {
            const user = await sequelize.query("SELECT id, name FROM users LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.userRepo.getUserById(user[0].id)
            result.name.should.equal(user[0].name);
        });

        it('getUserById() should return NULL for an invalid specified ID', async function() {
            const user = await sequelize.query("SELECT id FROM users ORDER BY created_at DESC LIMIT 1;",
                { type: QueryTypes.SELECT });

            const badId = user[0].id + 100;
            const result = await repositories.userRepo.getUserById(badId);
            expect(result).to.be.null;
        });

        it('getUserByName() should return a single user for a valid specified name', async function() {
            const user = await sequelize.query("SELECT id, name FROM users LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.userRepo.getUserByName(user[0].name)
            result.id.should.equal(user[0].id);
        });

        it('getUserByName() should return NULL for an invalid specified name', async function() {
            const badName = 'NoWayAUserIsNamedThis1234567_Test_Test';

            const result = await repositories.userRepo.getUserByName(badName);
            expect(result).to.be.null;
        });

        it('createUser() should create a user when a valid name is provided', async function() {
            let uuid = 'e82f1bca-03f9-42ad-b012-72e08f534ea7';
            let name = 'Me';
            let email = 'me@email.com';
            let description = 'ready to wail';
            let attributes = {
              uuid: uuid,
              name: name,
              email: email,
              description: description
            };

            const user = await repositories.userRepo.createUser(attributes);

            user.should.have.property('uuid').equal(uuid);
            user.should.have.property('name').equal(name);
            user.should.have.property('email').equal(email);
            user.should.have.property('description').equal(description);
        });

        it('createUser() should fail when a duplicate uuid is provided', async function() {
            let uuid = 'e82f1bca-03f9-42ad-b012-72e08f534ea7';
            let name = 'Me';
            let email = 'me2@email.com';
            let description = 'ready to wail';
            let attributes = {
                uuid: uuid,
                name: name,
                email: email,
                description: description
            };

            try {
                await repositories.userRepo.createUser(attributes);
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error');
            }
        });

        it('createUser() should fail when a duplicate email is provided', async function() {
            let uuid = 'e82f1bca-03f9-42ad-b012-72e08f534ea8';
            let name = 'Me';
            let email = 'me@email.com';
            let description = 'ready to wail';
            let attributes = {
                uuid: uuid,
                name: name,
                email: email,
                description: description
            };

            try {
                await repositories.userRepo.createUser(attributes);
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error');
            }
        });

        it('createUser() should fail if no uuid is provided', async function() {
            let name = 'Me';
            let email = 'me3@email.com';
            let description = 'ready to wail';
            let attributes = {
                uuid: null,
                name: name,
                email: email,
                description: description
            };

            try {
                await repositories.userRepo.createUser(attributes);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: User.uuid cannot be null');
            }
        });

        it('createUser() should fail if no name is provided', async function() {
            let uuid = 'e82f1bca-03f9-42ad-b012-72e08f534ea8';
            let email = 'me3@email.com';
            let description = 'ready to wail';
            let attributes = {
                uuid: uuid,
                name: null,
                email: email,
                description: description
            };

            try {
                await repositories.userRepo.createUser(attributes);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: User.name cannot be null');
            }
        });

        it('createUser() should fail if no email is provided', async function() {
            let name = 'Me';
            let uuid = 'e82f1bca-03f9-42ad-b012-72e08f534ea8';
            let description = 'ready to wail';
            let attributes = {
                uuid: uuid,
                name: name,
                email: null,
                description: description
            };

            try {
                await repositories.userRepo.createUser(attributes);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: User.email cannot be null');
            }
        });

        it('createUser() should create a user even if no description is provided', async function() {
            let uuid = 'e82f1bca-03f9-42ad-b012-72e08f534ea9';
            let name = 'Me';
            let email = 'me4@email.com';
            let attributes = {
                uuid: uuid,
                name: name,
                email: email
            };

            const user = await repositories.userRepo.createUser(attributes);

            user.should.have.property('uuid').equal(uuid);
            user.should.have.property('name').equal(name);
            user.should.have.property('email').equal(email);
            expect(user.description).to.be.undefined;
        });

        it('updateUser() should update the uuid of a user when a valid uuid is provided', async function() {
            const originalUuid = 'e82f1bca-03f9-42ad-b012-72e08f534ea9';
            const updatedUuid = 'e82f1bca-03f9-42ad-b012-72e08f534eb9';
            const originalUser = await sequelize.query(`SELECT id FROM users WHERE uuid = '${originalUuid}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.userRepo.updateUser(originalUser[0].id, { uuid : updatedUuid });

            const updatedUser = await sequelize.query(`SELECT id FROM users WHERE uuid = '${updatedUuid}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            updatedUser[0].id.should.equal(originalUser[0].id);
        });

        it('updateUser() should fail if the uuid provided is invalid', async function() {
            const originalUuid = '8fe05626-90fd-4c9e-9a2a-63d0c6c7c19e';
            const updatedUuid = null;
            const originalUser = await sequelize.query(`SELECT id FROM users WHERE uuid = '${originalUuid}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.userRepo.updateUser(originalUser[0].id, { uuid: updatedUuid });
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: User.uuid cannot be null');
            }
        });

        it('updateUser() should update the name of a user when a valid name is provided', async function() {
            const originalName = 'Test User 1';
            const updatedName = 'Updated Test User';
            const originalUser = await sequelize.query(`SELECT id FROM users WHERE name = '${originalName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.userRepo.updateUser(originalUser[0].id, { name : updatedName });

            const updatedUser = await sequelize.query(`SELECT id FROM users WHERE name = '${updatedName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            updatedUser[0].id.should.equal(originalUser[0].id);
        });

        it('updateUser() should fail if the name provided is invalid', async function() {
            const originalName = 'Test User 2';
            const updatedName = null;
            const originalUser = await sequelize.query(`SELECT id FROM users WHERE name = '${originalName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.userRepo.updateUser(originalUser[0].id, { name: updatedName });
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: User.name cannot be null');
            }
        });

        it('updateUser() should update the email of a user when a valid email is provided', async function() {
            const originalEmail = 'me4@email.com';
            const updatedEmail = 'me5@email.com';
            const originalUser = await sequelize.query(`SELECT id FROM users WHERE email = '${originalEmail}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.userRepo.updateUser(originalUser[0].id, { email : updatedEmail });

            const updatedUser = await sequelize.query(`SELECT id FROM users WHERE email = '${updatedEmail}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            updatedUser[0].id.should.equal(originalUser[0].id);
        });

        it('updateUser() should fail if the email provided is invalid', async function() {
            const originalEmail = 'testuser1@email.com';
            const updatedEmail = null;
            const originalUser = await sequelize.query(`SELECT id FROM users WHERE email = '${originalEmail}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.userRepo.updateUser(originalUser[0].id, { email: updatedEmail });
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: User.email cannot be null');
            }
        });

        it('updateUser() should update the description of a user when a valid description is provided', async function() {
            const originalDescription = 'ready to wail';
            const updatedDescription = 'wut';
            const originalUser = await sequelize.query(`SELECT id FROM users WHERE description = '${originalDescription}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.userRepo.updateUser(originalUser[0].id, { description : updatedDescription });

            const updatedUser = await sequelize.query(`SELECT id FROM users WHERE description = '${updatedDescription}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            updatedUser[0].id.should.equal(originalUser[0].id);
        });

        it('deleteUser() should destroy a user when a valid id is provided', async function() {
            let uuid = 'e82f1bca-03f9-42ad-b012-72e08f534ec6';
            let name = 'Deletable User';
            let email = 'delete_me@email.com';
            let description = 'ready to exit';

            await sequelize.query(`INSERT INTO users (uuid, name, email, description) VALUES ('${uuid}', '${name}', '${email}', '${description}');`,
                { type: QueryTypes.INSERT });
            const user = await sequelize.query(`SELECT id FROM users WHERE uuid = '${uuid}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.userRepo.deleteUser(user[0].id);

            const check = await sequelize.query(`SELECT id FROM users WHERE uuid = '${uuid}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            expect(check).to.be.empty;
        });
    });
});