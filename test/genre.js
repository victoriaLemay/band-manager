require('chai').should();
const expect = require('chai').expect;
const { QueryTypes } = require('sequelize');

const { getDb } = require('../src/database/db');

let repositories;
let sequelize;

describe('Genre Tests', function() {
    before(() => {
        sequelize = getDb();
        repositories = require('../src/providers');
    });

    after(function() {
        console.log('Genre Tests Complete');
    });

    describe('Genre Repo Tests', function() {
        it('getGenres() should only return the number of results specified in the limit', async function() {
            const limit = 2;
            const genreCount = await sequelize.query("SELECT COUNT(0) as total FROM genres;", { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.genreRepo.getGenres(limit);
            count.should.be.a('number');
            count.should.equal(genreCount[0].total);

            const records = rows.map(result => result.getDataValue('name'));
            records.length.should.equal(limit);
        });

        it('getGenres() should apply a WHERE clause according to the specified search criteria', async function() {
            const search = 'P%';
            const searchCount = await sequelize.query(`SELECT COUNT(0) as total FROM genres WHERE name LIKE '${search}' LIMIT 0, 50`,
                { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.genreRepo.getGenres(50, 0, search);
            const records = rows.map(result => result.getDataValue('name'));
            records.length.should.equal(searchCount[0].total);
        });

        it('getGenres() should only return data for the specified columns', async function() {
            const columns = ['name'];

            const { count, rows } = await repositories.genreRepo.getGenres(50, 0, '', columns);
            rows[0].getDataValue('name').should.be.a('string');
            try {
                rows[0].getDataValue('id');
            } catch (err) {
                err.should.be.an('TypeError');
            }
        });

        it('getGenreById() should return a single artist for a valid specified ID', async function() {
            const genre = await sequelize.query("SELECT id, name FROM genres LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.genreRepo.getGenreById(genre[0].id)
            result.name.should.equal(genre[0].name);
        });

        it('getGenreById() should return NULL for an invalid specified ID', async function() {
            const genre = await sequelize.query("SELECT id FROM genres ORDER BY created_at DESC LIMIT 1;",
                { type: QueryTypes.SELECT });

            const badId = genre[0].id + 100;
            const result = await repositories.genreRepo.getGenreById(badId);
            expect(result).to.be.null;
        });

        it('getGenreByName() should return a single genre for a valid specified name', async function() {
            const genre = await sequelize.query("SELECT id, name FROM genres LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.genreRepo.getGenreByName(genre[0].name)
            result.id.should.equal(genre[0].id);
        });

        it('getGenreByName() should return NULL for an invalid specified name', async function() {
            const badName = 'NoWayAGenreIsNamedThis1234567_Test_Test';

            const result = await repositories.genreRepo.getGenreByName(badName);
            expect(result).to.be.null;
        });

        it('createGenre() should create a genre when a valid name is provided', async function() {
            let name = 'Rockabilly';
            let attributes = {name: name};
            const genre = await repositories.genreRepo.createGenre(attributes);
            genre.should.have.property('name').equal(name);
        });

        it('createGenre() should fail when a duplicate name is provided', async function() {
            let name = 'Rockabilly';
            let attributes = {name: name};
            try {
                await repositories.genreRepo.createGenre(attributes);
            } catch(err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error');
            }
        });

        it('createGenre() should throw an exception if no name is provided', async function() {
            try {
                await repositories.genreRepo.createGenre({name: null});
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: Genre.name cannot be null');
            }
        });

        it('updateGenre() should update the name of a genre when a valid name is provided', async function() {
            const originalName = 'Test Genre';
            const updatedName = 'Updated Test Genre';
            await sequelize.query(`INSERT INTO genres (name) VALUES ('${originalName}');`, { type: QueryTypes.INSERT });
            const originalGenre = await sequelize.query(`SELECT id FROM genres WHERE name = '${originalName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.genreRepo.updateGenre(originalGenre[0].id, { name : updatedName });

            const updatedGenre = await sequelize.query(`SELECT id FROM genres WHERE name = '${updatedName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            updatedGenre[0].id.should.equal(originalGenre[0].id);
        });

        it('updateGenre() should fail if the name provided is invalid', async function() {
            const originalName = 'Another Test Genre';
            const updatedName = null;
            await sequelize.query(`INSERT INTO genres (name) VALUES ('${originalName}');`, { type: QueryTypes.INSERT });
            const originalGenre = await sequelize.query(`SELECT id FROM genres WHERE name = '${originalName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.genreRepo.updateGenre(originalGenre[0].id, { name: updatedName });
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: Genre.name cannot be null');
            }
        });

        it('deleteGenre() should destroy a genre when a valid id is provided', async function() {
            const name = 'One More Test Genre';
            await sequelize.query(`INSERT INTO genres (name) VALUES ('${name}');`, { type: QueryTypes.INSERT });
            const genre = await sequelize.query(`SELECT id FROM genres WHERE name = '${name}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.genreRepo.deleteGenre(genre[0].id);

            const check = await sequelize.query(`SELECT id FROM genres WHERE name = '${name}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            expect(check).to.be.empty;
        });
    });
});