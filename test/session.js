require('chai').should();
const expect = require('chai').expect;
const { QueryTypes } = require('sequelize');

const { getDb } = require('../src/database/db');

let repositories;
let sequelize;

describe('Session Tests', function() {
    before(() => {
        sequelize = getDb();
        repositories = require('../src/providers');
    });

    after(function () {
        console.log('Session Tests Complete');
    });

    describe('Session Repo Tests', function () {
        it('getSessions() should only return the number of results specified in the limit', async function() {
            const limit = 2;
            const sessionCount = await sequelize.query("SELECT COUNT(0) as total FROM sessions;", { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.sessionRepo.getSessions(limit);
            count.should.be.a('number');
            count.should.equal(sessionCount[0].total);

            const records = rows.map(result => result.getDataValue('started_at'));
            records.length.should.equal(limit);
        });

        it('getSessions() should only return data for the specified columns', async function() {
            const columns = ['started_at'];

            const { count, rows } = await repositories.sessionRepo.getSessions(50, 0, columns);
            rows[0].getDataValue('started_at').should.be.a('string');
            try {
                rows[0].getDataValue('id');
            } catch (err) {
                err.should.be.an('TypeError');
            }
        });

        it('getSessionById() should return a single session for a valid specified ID', async function() {
            const session = await sequelize.query("SELECT id, started_at FROM sessions LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.sessionRepo.getSessionById(session[0].id)
            result.started_at.should.equal(session[0].started_at);
        });

        it('getSessionById() should return NULL for an invalid specified ID', async function() {
            const session = await sequelize.query("SELECT id FROM sessions ORDER BY created_at DESC LIMIT 1;",
                { type: QueryTypes.SELECT });

            const badId = session[0].id + 100;
            const result = await repositories.sessionRepo.getSessionById(badId);
            expect(result).to.be.null;
        });

        it('createSession() should create a session when valid parameters are provided', async function() {
            let startedAt = '1970-01-01';
            let showcasedAt = '1970-03-01 04:00:00';
            let showcaseLocation = 'CBGB OMFUG';
            let attributes = {
                started_at: startedAt,
                showcased_at: showcasedAt,
                showcase_location: showcaseLocation
            }

            const session = await repositories.sessionRepo.createSession(attributes);

            session.should.have.property('started_at').equal(startedAt);
            session.should.have.property('showcased_at');
            session.should.have.property('showcase_location').equal(showcaseLocation);
        });

        it('createSession() should fail if no started_at is provided', async function() {
            let showcasedAt = '1970-03-01 04:00:00';
            let showcaseLocation = 'CBGB OMFUG';
            let attributes = {
                showcased_at: showcasedAt,
                showcase_location: showcaseLocation
            }

            try {
                await repositories.sessionRepo.createSession(attributes);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: Session.started_at cannot be null');
            }
        });

        it('createSession() should fail if no showcased_at is provided', async function() {
            let startedAt = '1970-03-01';
            let showcaseLocation = 'CBGB OMFUG';
            let attributes = {
                started_at: startedAt,
                showcase_location: showcaseLocation
            }

            try {
                await repositories.sessionRepo.createSession(attributes);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: Session.showcased_at cannot be null');
            }
        });

        it('updateSession() should update the started_at of a session when a valid date is provided', async function() {
            const originalStartedAt = '1970-01-01';
            const updatedStartedAt = '1980-01-01';
            const originalSession = await sequelize.query(`SELECT id FROM sessions WHERE started_at = '${originalStartedAt}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.sessionRepo.updateSession(originalSession[0].id, { started_at : updatedStartedAt });

            const updatedSession = await sequelize.query(`SELECT id FROM sessions WHERE started_at = '${updatedStartedAt}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            updatedSession[0].id.should.equal(originalSession[0].id);
        });

        it('updateSession() should update the showcase_location of a session when a valid string is provided', async function() {
            const originalShowcaseLocation = 'Mohawk';
            const updatedShowcaseLocation = 'The Barn';
            const originalSession = await sequelize.query(`SELECT id FROM sessions WHERE 
                showcase_location = "${originalShowcaseLocation}" LIMIT 1;`, { type: QueryTypes.SELECT });

            await repositories.sessionRepo.updateSession(originalSession[0].id,
                { showcase_location : updatedShowcaseLocation });

            const updatedSession = await sequelize.query(`SELECT id FROM sessions WHERE 
                showcase_location = '${updatedShowcaseLocation}' LIMIT 1;`, { type: QueryTypes.SELECT });

            updatedSession[0].id.should.equal(originalSession[0].id);
        });

        it('deleteSession() should destroy a session when a valid id is provided', async function() {
            let startedAt = '1985-01-01';
            let showcasedAt = '1985-03-01 04:00:00';
            let showcaseLocation = 'Studio 54';

            await sequelize.query(`INSERT INTO sessions (started_at, showcased_at, showcase_location) 
                VALUES ('${startedAt}', '${showcasedAt}', '${showcaseLocation}');`,
                { type: QueryTypes.INSERT });
            const session = await sequelize.query(`SELECT id FROM sessions WHERE started_at = '${startedAt}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.sessionRepo.deleteSession(session[0].id);

            const check = await sequelize.query(`SELECT id FROM sessions WHERE started_at = '${startedAt}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            expect(check).to.be.empty;
        });
    });
});