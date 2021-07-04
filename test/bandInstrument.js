require('chai').should();
const expect = require('chai').expect;
const { QueryTypes } = require('sequelize');

const { getDb } = require('../src/database/db');

let repositories;
let sequelize;

describe('Band Instrument Tests', function() {
    before(() => {
        sequelize = getDb();
        repositories = require('../src/providers');
    });

    after(function () {
        console.log('Band Instrument Tests Complete');
    });

    describe('Band Instrument Repo Tests', function () {
        it('getAllBandInstrumentsForABand() should return all band instruments for a valid band ID', async function() {
            const band = await sequelize.query("SELECT id, name FROM bands LIMIT 1;", { type: QueryTypes.SELECT });
            const instrumentCount = await sequelize.query(`SELECT COUNT(0) as total FROM band_instruments WHERE band_id = ?`,
                {
                    replacements: [ band[0].id ],
                    type: QueryTypes.SELECT
                });

            const bandInstruments = await repositories.bandInstrumentRepo.getAllBandInstrumentsForABand(band[0].id);

            bandInstruments.length.should.equal(instrumentCount[0].total);
        });

        it('getAllBandInstrumentsForABand() should return an empty result for an invalid band ID', async function() {
            const invalidBandId = 23456;

            const bandInstruments = await repositories.bandInstrumentRepo.getAllBandInstrumentsForABand(invalidBandId);

            bandInstruments.length.should.equal(0);
        });

        it('getAllBandInstrumentsForABand() should return relations if they are provided', async function() {
            const band = await sequelize.query("SELECT id, name FROM bands LIMIT 1;", { type: QueryTypes.SELECT });

            const bandInstruments = await repositories.bandInstrumentRepo.getAllBandInstrumentsForABand(band[0].id, ['Band']);

            bandInstruments[0].should.have.property('Band');
            (bandInstruments[0].Band).should.have.property('id').equal(band[0].id);
        });

        it('getBandInstrumentById() should return a single band instrument for a valid specified ID', async function() {
            const bandInstrument = await sequelize.query("SELECT id, band_id FROM band_instruments LIMIT 1;",
                { type: QueryTypes.SELECT });

            const result = await repositories.bandInstrumentRepo.getBandInstrumentById(bandInstrument[0].id)
            result.band_id.should.equal(bandInstrument[0].band_id);
        });

        it('getBandInstrumentById() should return NULL for an invalid specified ID', async function() {
            const bandInstrument = await sequelize.query("SELECT id FROM band_instruments ORDER BY created_at DESC LIMIT 1;",
                { type: QueryTypes.SELECT });

            const badId = bandInstrument[0].id + 100;
            const result = await repositories.bandRepo.getBandById(badId);
            expect(result).to.be.null;
        });

        it('createBandInstrument() should create a band instrument when valid attributes are provided', async function() {
            let bandId = 1;
            let instrumentId = 1;
            let userId = 1;
            let attributes = {
                band_id: bandId,
                instrument_id: instrumentId,
                user_id: userId
            };

            const bandInstrument = await repositories.bandInstrumentRepo.createBandInstrument(attributes);

            bandInstrument.should.have.property('band_id').equal(bandId);
            bandInstrument.should.have.property('instrument_id').equal(instrumentId);
            bandInstrument.should.have.property('user_id').equal(userId);
        });

        it('createBandInstrument() should create a band instrument with a NULL user_id when it is not provided', async function() {
            let bandId = 1;
            let instrumentId = 2;
            let attributes = {
                band_id: bandId,
                instrument_id: instrumentId,
            };

            const bandInstrument = await repositories.bandInstrumentRepo.createBandInstrument(attributes);

            bandInstrument.should.have.property('band_id').equal(bandId);
            bandInstrument.should.have.property('instrument_id').equal(instrumentId);
            expect(bandInstrument.user_id).to.be.undefined;
        });

        it('createBandInstrument() should not create a band instrument for a duplicate band_id/instrument_id pair', async function() {
            let bandId = 2;
            let instrumentId = 2;
            let attributes = {
                band_id: bandId,
                instrument_id: instrumentId
            };

            const bandInstrument = await repositories.bandInstrumentRepo.createBandInstrument(attributes);

            bandInstrument.should.have.property('band_id').equal(bandId);
            bandInstrument.should.have.property('instrument_id').equal(instrumentId);
            expect(bandInstrument.user_id).to.be.undefined;

            try {
                await repositories.bandInstrumentRepo.createBandInstrument(attributes);
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error: instrument_id already exists for this band_id');
            }
        });

        it('updateBandInstrument() should update the user_id of a band instrument when a valid user_id is provided', async function() {
            const updatedUserId = 1;
            const originalBandInstrument = await sequelize.query(
                `SELECT id FROM band_instruments WHERE user_id IS NULL LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.bandInstrumentRepo.updateBandInstrument(originalBandInstrument[0].id,
                { user_id : updatedUserId });

            const updatedBandInstrument = await sequelize.query(
                `SELECT id FROM band_instruments WHERE user_id = '${updatedUserId}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            updatedBandInstrument[0].id.should.equal(originalBandInstrument[0].id);
        });

        it('updateBandInstrument() should fail if the band_id provided is invalid', async function() {
            const originalBandId = 1;
            const updatedBandId = 100;
            const originalBandInstrument = await sequelize.query(
                `SELECT id FROM band_instruments WHERE band_id = '${originalBandId}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.bandInstrumentRepo.updateBandInstrument(originalBandInstrument[0].id,
                    { band_id: updatedBandId });
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error: band_id not found');
            }
        });

        it('updateBandInstrument() should fail if the instrument_id provided is invalid', async function() {
            const originalInstrumentId = 3;
            const updatedInstrumentId = 100;
            const originalBand = await sequelize.query(
                `SELECT id FROM band_instruments WHERE instrument_id = '${originalInstrumentId}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.bandInstrumentRepo.updateBandInstrument(originalBand[0].id,
                    { instrument_id: updatedInstrumentId });
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error: instrument_id not found');
            }
        });

        it('updateBandInstrument() should fail if the user_id provided is invalid', async function() {
            const updatedUserId = 100;
            const originalBandInstrument = await sequelize.query(
                `SELECT id FROM band_instruments WHERE user_id IS NULL LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.bandInstrumentRepo.updateBandInstrument(originalBandInstrument[0].id,
                    { user_id: updatedUserId });
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error: user_id not found');
            }
        });

        it('deleteBandInstrument() should destroy a band instrument when a valid id is provided', async function() {
            let bandId = 3;
            let instrumentId = 3;
            let userId = 3;

            await sequelize.query(`INSERT INTO band_instruments (band_id, instrument_id, user_id) 
                VALUES (${bandId}, ${instrumentId}, ${userId});`, { type: QueryTypes.INSERT });
            const bandInstrument = await sequelize.query(
                `SELECT id FROM band_instruments WHERE band_id = '${bandId}' AND instrument_id = '${instrumentId}'
                    AND user_id = '${userId}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.bandInstrumentRepo.deleteBandInstrument(bandInstrument[0].id);

            const check = await sequelize.query(
                `SELECT id FROM band_instruments WHERE band_id = '${bandId}' AND instrument_id = '${instrumentId}'
                    AND user_id = '${userId}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            expect(check).to.be.empty;
        });
    });
});