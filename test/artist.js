require('chai').should();
const expect = require('chai').expect;
const { QueryTypes } = require('sequelize');

const { getDb } = require('../src/db');

let repositories;
let sequelize;

describe('Artist Tests', function() {
    before(() => {
        sequelize = getDb();
        repositories = require('../src/repositories/repositories');
    });

    after(function() {
        console.log('Artist Tests Complete');
    });

    describe('Artist Repo Tests', function() {
        it('getArtists() should only return the number of results specified in the limit', async function() {
            const limit = 2;
            const artistCount = await sequelize.query("SELECT COUNT(0) as total FROM artists;", { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.artistRepo.getArtists(limit);
            count.should.be.a('number');
            count.should.equal(artistCount[0].total);

            const records = rows.map(result => result.getDataValue('name'));
            records.length.should.equal(limit);
        });

        it('getArtists() should apply a WHERE clause according to the specified search criteria', async function() {
            const search = 'T%';
            const searchCount = await sequelize.query(`SELECT COUNT(0) as total FROM artists WHERE name LIKE '${search}' LIMIT 0, 50`,
                { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.artistRepo.getArtists(50, 0, search);
            const records = rows.map(result => result.getDataValue('name'));
            records.length.should.equal(searchCount[0].total);
        });

        it('getArtists() should only return data for the specified columns', async function() {
            const columns = ['name'];

            const { count, rows } = await repositories.artistRepo.getArtists(50, 0, '', columns);
            rows[0].getDataValue('name').should.be.a('string');
            try {
                rows[0].getDataValue('id');
            } catch (err) {
                err.should.be.an('TypeError');
            }
        });

        it('getArtistById() should return a single artist for a valid specified ID', async function() {
            const artist = await sequelize.query("SELECT id, name FROM artists LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.artistRepo.getArtistById(artist[0].id)
            result.name.should.equal(artist[0].name);
        });

        it('getArtistById() should return NULL for an invalid specified ID', async function() {
            const artist = await sequelize.query("SELECT id FROM artists ORDER BY created_at DESC LIMIT 1;",
                { type: QueryTypes.SELECT });

            const badId = artist[0].id + 100;
            const result = await repositories.artistRepo.getArtistById(badId);
            expect(result).to.be.null;
        });

        it('getArtistByName() should return a single artist for a valid specified name', async function() {
            const artist = await sequelize.query("SELECT id, name FROM artists LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.artistRepo.getArtistByName(artist[0].name)
            result.id.should.equal(artist[0].id);
        });

        it('getArtistByName() should return NULL for an invalid specified name', async function() {
            const badName = 'NoWayABandIsNamedThis1234567_Test_Test';

            const result = await repositories.artistRepo.getArtistByName(badName);
            expect(result).to.be.null;
        });

        it('createArtist() should create an artist when a valid name is provided', async function() {
            let artist, created;
            let name = 'AFI';
            [artist, created] = await repositories.artistRepo.createArtist(name);
            artist.should.have.property('name').equal(name);
            created.should.be.a('boolean');
            created.should.equal(true);
        });

        it('createArtist() should return an existing artist when a duplicate name is provided', async function() {
            let artist, created;
            let name = 'AFI';
            [artist, created] = await repositories.artistRepo.createArtist(name);
            artist.should.have.property('name').equal(name);
            created.should.be.a('boolean');
            created.should.equal(false);
        });

        it('createArtist() should throw an exception if no name is provided', async function() {
            try {
                await repositories.artistRepo.createArtist(null);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: Artist.name cannot be null');
            }
        });

        it('updateArtist() should update the name of an artist when a valid name is provided', async function() {
            const originalName = 'Test Artist';
            const updatedName = 'Updated Test Artist';
            await sequelize.query(`INSERT INTO artists (name) VALUES ('${originalName}');`, { type: QueryTypes.INSERT });
            const originalArtist = await sequelize.query(`SELECT id FROM artists WHERE name = '${originalName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.artistRepo.updateArtist(originalName, updatedName);

            const updatedArtist = await sequelize.query(`SELECT id FROM artists WHERE name = '${updatedName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            updatedArtist[0].id.should.equal(originalArtist[0].id);
        });

        it('updateArtist() should fail if the name provided is invalid', async function() {
            const originalName = 'Another Test Artist';
            const updatedName = null;
            await sequelize.query(`INSERT INTO artists (name) VALUES ('${originalName}');`, { type: QueryTypes.INSERT });

            try {
                await repositories.artistRepo.updateArtist(originalName, updatedName);
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: Artist.name cannot be null');
            }
        });

        it('deleteArtist() should destroy an artist when a valid id is provided', async function() {
            const name = 'One More Test Artist';
            await sequelize.query(`INSERT INTO artists (name) VALUES ('${name}');`, { type: QueryTypes.INSERT });
            const artist = await sequelize.query(`SELECT id FROM artists WHERE name = '${name}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.artistRepo.deleteArtist(artist[0].id);

            const check = await sequelize.query(`SELECT id FROM artists WHERE name = '${name}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            expect(check).to.be.empty;
        });
    });
});
