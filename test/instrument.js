require('chai').should();
const expect = require('chai').expect;
const { QueryTypes } = require('sequelize');

const { getDb } = require('../src/db');

let repositories;
let sequelize;

describe('Instrument Tests', function() {
    before(() => {
        sequelize = getDb();
        repositories = require('../src/providers');
    });

    after(function () {
        console.log('Instrument Tests Complete');
    });

    describe('Instrument Repo Tests', function () {
        it('getInstruments() should only return the number of results specified in the limit', async function() {
            const limit = 2;
            const instrumentCount = await sequelize.query("SELECT COUNT(0) as total FROM instruments;", { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.instrumentRepo.getInstruments(limit);
            count.should.be.a('number');
            count.should.equal(instrumentCount[0].total);

            const records = rows.map(result => result.getDataValue('name'));
            records.length.should.equal(limit);
        });

        it('getInstruments() should apply a WHERE clause according to the specified search criteria', async function() {
            const search = 'L%';
            const searchCount = await sequelize.query(`SELECT COUNT(0) as total FROM instruments WHERE name LIKE '${search}' LIMIT 0, 50`,
                { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.instrumentRepo.getInstruments(50, 0, search);
            const records = rows.map(result => result.getDataValue('name'));
            records.length.should.equal(searchCount[0].total);
        });

        it('getInstruments() should only return data for the specified columns', async function() {
            const columns = ['name'];

            const { count, rows } = await repositories.instrumentRepo.getInstruments(50, 0, '', columns);
            rows[0].getDataValue('name').should.be.a('string');
            try {
                rows[0].getDataValue('id');
            } catch (err) {
                err.should.be.an('TypeError');
            }
        });

        it('getInstrumentById() should return a single instrument for a valid specified ID', async function() {
            const instrument = await sequelize.query("SELECT id, name FROM instruments LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.instrumentRepo.getInstrumentById(instrument[0].id)
            result.name.should.equal(instrument[0].name);
        });

        it('getInstrumentById() should return NULL for an invalid specified ID', async function() {
            const instrument = await sequelize.query("SELECT id FROM instruments ORDER BY created_at DESC LIMIT 1;",
                { type: QueryTypes.SELECT });

            const badId = instrument[0].id + 100;
            const result = await repositories.instrumentRepo.getInstrumentById(badId);
            expect(result).to.be.null;
        });

        it('getInstrumentByName() should return a single instrument for a valid specified name', async function() {
            const instrument = await sequelize.query("SELECT id, name FROM instruments LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.instrumentRepo.getInstrumentByName(instrument[0].name)
            result.id.should.equal(instrument[0].id);
        });

        it('getInstrumentByName() should return NULL for an invalid specified name', async function() {
            const badName = 'NoWayAnInstrumentIsNamedThis1234567_Test_Test';

            const result = await repositories.instrumentRepo.getInstrumentByName(badName);
            expect(result).to.be.null;
        });

        it('createInstrument() should create an instrument when a valid name is provided', async function() {
            let name = 'Theramin';
            const instrument  = await repositories.instrumentRepo.createInstrument(name);
            instrument.should.have.property('name').equal(name);
        });

        it('createInstrument() should return an existing instrument when a duplicate name is provided', async function() {
            let name = 'Theramin';
            try {
                await repositories.instrumentRepo.createInstrument(name);
            } catch(err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error');
            }
        });

        it('createInstrument() should throw an exception if no name is provided', async function() {
            try {
                await repositories.instrumentRepo.createInstrument(null);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: Instrument.name cannot be null');
            }
        });

        it('updateInstrument() should update the name of an instrument when a valid name is provided', async function() {
            const originalName = 'Test Instrument';
            const updatedName = 'Updated Test Instrument';
            await sequelize.query(`INSERT INTO instruments (name) VALUES ('${originalName}');`, { type: QueryTypes.INSERT });
            const originalInstrument = await sequelize.query(`SELECT id FROM instruments WHERE name = '${originalName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.instrumentRepo.updateInstrument(originalInstrument[0].id, { name: updatedName });

            const updatedInstrument = await sequelize.query(`SELECT id FROM instruments WHERE name = '${updatedName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            updatedInstrument[0].id.should.equal(originalInstrument[0].id);
        });

        it('updateInstrument() should fail if the name provided is invalid', async function() {
            const originalName = 'Another Test Instrument';
            const updatedName = null;
            await sequelize.query(`INSERT INTO instruments (name) VALUES ('${originalName}');`, { type: QueryTypes.INSERT });
            const originalInstrument = await sequelize.query(`SELECT id FROM instruments WHERE name = '${originalName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.instrumentRepo.updateInstrument(originalInstrument[0].id, updatedName);
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: Instrument.name cannot be null');
            }
        });

        it('deleteInstrument() should destroy an instrument when a valid id is provided', async function() {
            const name = 'One More Test Instrument';
            await sequelize.query(`INSERT INTO instruments (name) VALUES ('${name}');`, { type: QueryTypes.INSERT });
            const instrument = await sequelize.query(`SELECT id FROM instruments WHERE name = '${name}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.instrumentRepo.deleteInstrument(instrument[0].id);

            const check = await sequelize.query(`SELECT id FROM instruments WHERE name = '${name}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            expect(check).to.be.empty;
        });
    });
});