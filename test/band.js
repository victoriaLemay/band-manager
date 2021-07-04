require('chai').should();
const expect = require('chai').expect;
const { QueryTypes } = require('sequelize');

const { getDb } = require('../src/database/db');

let repositories;
let sequelize;

describe('Band Tests', function() {
    before(() => {
        sequelize = getDb();
        repositories = require('../src/providers');
    });

    after(function () {
        console.log('Band Tests Complete');
    });

    describe('Band Repo Tests', function () {
        it('getBands() should only return the number of results specified in the limit', async function() {
            const limit = 2;
            const bandCount = await sequelize.query("SELECT COUNT(0) as total FROM bands;", { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.bandRepo.getBands(limit);
            count.should.be.a('number');
            count.should.equal(bandCount[0].total);

            const records = rows.map(result => result.getDataValue('name'));
            records.length.should.equal(limit);
        });

        it('getBands() should apply a WHERE clause according to the specified search criteria', async function() {
            const search = '%1';
            const searchCount = await sequelize.query(`SELECT COUNT(0) as total FROM bands WHERE name LIKE '${search}' LIMIT 0, 50`,
                { type: QueryTypes.SELECT });

            const { count, rows } = await repositories.bandRepo.getBands(50, 0, search);
            const records = rows.map(result => result.getDataValue('name'));
            records.length.should.equal(searchCount[0].total);
        });

        it('getBands() should only return data for the specified columns', async function() {
            const columns = ['name'];

            const { count, rows } = await repositories.bandRepo.getBands(50, 0, '', columns);
            rows[0].getDataValue('name').should.be.a('string');
            try {
                rows[0].getDataValue('id');
            } catch (err) {
                err.should.be.an('TypeError');
            }
        });

        it('getBandById() should return a single band for a valid specified ID', async function() {
            const band = await sequelize.query("SELECT id, name FROM bands LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.bandRepo.getBandById(band[0].id)
            result.name.should.equal(band[0].name);
        });

        it('getBandById() should return NULL for an invalid specified ID', async function() {
            const band = await sequelize.query("SELECT id FROM bands ORDER BY created_at DESC LIMIT 1;",
                { type: QueryTypes.SELECT });

            const badId = band[0].id + 100;
            const result = await repositories.bandRepo.getBandById(badId);
            expect(result).to.be.null;
        });

        it('getBandByName() should return a single band for a valid specified name', async function() {
            const band = await sequelize.query("SELECT id, name FROM bands LIMIT 1;", { type: QueryTypes.SELECT });

            const result = await repositories.bandRepo.getBandByName(band[0].name)
            result.id.should.equal(band[0].id);
        });

        it('createBand() should create a band when valid attributes are provided', async function() {
            let sessionId = 1;
            let artistId = 1;
            let genreId = 1;
            let name = 'tankini torture';
            let imageURL = 'http://www.images.com/image.jpg';
            let dayOfWeek = 'Monday';
            let startsAt = '20:00:00';
            let endsAt = '21:30:00';
            let price = 200.00;
            let durationWeeks = 8;
            let attributes = {
                session_id: sessionId,
                artist_id: artistId,
                genre_id: genreId,
                name: name,
                image_url: imageURL,
                day_of_week: dayOfWeek,
                starts_at: startsAt,
                ends_at: endsAt,
                price: price,
                duration_weeks: durationWeeks
            };

            const band = await repositories.bandRepo.createBand(attributes);

            band.should.have.property('session_id').equal(sessionId);
            band.should.have.property('artist_id').equal(artistId);
            band.should.have.property('genre_id').equal(genreId);
            band.should.have.property('name').equal(name);
            band.should.have.property('image_url').equal(imageURL);
            band.should.have.property('day_of_week').equal(dayOfWeek);
            band.should.have.property('starts_at').equal(startsAt);
            band.should.have.property('ends_at').equal(endsAt);
            band.should.have.property('price').equal(price);
            band.should.have.property('duration_weeks').equal(durationWeeks);
        });

        it('createBand() should trigger creation of default band instruments if successful', async function() {
            let sessionId = 2;
            let artistId = 2;
            let genreId = 2;
            let name = 'bikini kill';
            let imageURL = 'http://www.images.com/image.jpg';
            let dayOfWeek = 'Wednesday';
            let startsAt = '20:00:00';
            let endsAt = '21:30:00';
            let price = 200.00;
            let durationWeeks = 8;
            let attributes = {
                session_id: sessionId,
                artist_id: artistId,
                genre_id: genreId,
                name: name,
                image_url: imageURL,
                day_of_week: dayOfWeek,
                starts_at: startsAt,
                ends_at: endsAt,
                price: price,
                duration_weeks: durationWeeks
            };

            const band = await repositories.bandRepo.createBand(attributes);

            const instrumentCount = await sequelize.query(`SELECT COUNT(0) as total FROM instruments WHERE is_band_default = 1;`,
                { type: QueryTypes.SELECT });
            const bandInstruments = await sequelize.query(`SELECT id FROM band_instruments WHERE band_id = '${band.id}';`,
                { type: QueryTypes.SELECT });

            bandInstruments.length.should.equal(instrumentCount[0].total);
        });

        it('createBand() should fail if no session_id is provided', async function() {
            let artistId = 1;
            let genreId = 1;
            let name = 'tankini torture';
            let imageURL = 'http://www.images.com/image.jpg';
            let dayOfWeek = 'Monday';
            let startsAt = '20:00:00';
            let endsAt = '21:30:00';
            let price = 200.00;
            let durationWeeks = 8;
            let attributes = {
                artist_id: artistId,
                genre_id: genreId,
                name: name,
                image_url: imageURL,
                day_of_week: dayOfWeek,
                starts_at: startsAt,
                ends_at: endsAt,
                price: price,
                duration_weeks: durationWeeks
            };

            try {
                await repositories.bandRepo.createBand(attributes);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('notNull Violation: Band.session_id cannot be null');
            }
        });

        it('createBand() should fail if the session_id provided does not exist', async function() {
            let sessionId = 100;
            let artistId = 1;
            let genreId = 1;
            let name = 'tankini torture';
            let imageURL = 'http://www.images.com/image.jpg';
            let dayOfWeek = 'Monday';
            let startsAt = '20:00:00';
            let endsAt = '21:30:00';
            let price = 200.00;
            let durationWeeks = 8;
            let attributes = {
                session_id: sessionId,
                artist_id: artistId,
                genre_id: genreId,
                name: name,
                image_url: imageURL,
                day_of_week: dayOfWeek,
                starts_at: startsAt,
                ends_at: endsAt,
                price: price,
                duration_weeks: durationWeeks
            };

            try {
                await repositories.bandRepo.createBand(attributes);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error: session_id not found');
            }
        });

        it('createBand() should fail if the artist_id provided does not exist', async function() {
            let sessionId = 1;
            let artistId = 100;
            let genreId = 1;
            let name = 'tankini torture';
            let imageURL = 'http://www.images.com/image.jpg';
            let dayOfWeek = 'Monday';
            let startsAt = '20:00:00';
            let endsAt = '21:30:00';
            let price = 200.00;
            let durationWeeks = 8;
            let attributes = {
                session_id: sessionId,
                artist_id: artistId,
                genre_id: genreId,
                name: name,
                image_url: imageURL,
                day_of_week: dayOfWeek,
                starts_at: startsAt,
                ends_at: endsAt,
                price: price,
                duration_weeks: durationWeeks
            };

            try {
                await repositories.bandRepo.createBand(attributes);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error: artist_id not found');
            }
        });

        it('createBand() should fail if the genre_id provided does not exist', async function() {
            let sessionId = 1;
            let artistId = 1;
            let genreId = 100;
            let name = 'tankini torture';
            let imageURL = 'http://www.images.com/image.jpg';
            let dayOfWeek = 'Monday';
            let startsAt = '20:00:00';
            let endsAt = '21:30:00';
            let price = 200.00;
            let durationWeeks = 8;
            let attributes = {
                session_id: sessionId,
                artist_id: artistId,
                genre_id: genreId,
                name: name,
                image_url: imageURL,
                day_of_week: dayOfWeek,
                starts_at: startsAt,
                ends_at: endsAt,
                price: price,
                duration_weeks: durationWeeks
            };

            try {
                await repositories.bandRepo.createBand(attributes);
            }
            catch(err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error: genre_id not found');
            }
        });

        it('createBand() should create a band even if no attributes except session_id are provided', async function() {
            let sessionId = 1;
            let attributes = {
                session_id: sessionId
            };

            const band = await repositories.bandRepo.createBand(attributes);

            band.should.have.property('session_id').equal(sessionId);
            expect(band.artist_id).to.be.undefined;
            expect(band.day_of_week).to.be.undefined;
            expect(band.price).to.be.undefined;
        });

        it('updateBand() should update the name of a band when a valid name is provided', async function() {
            const originalName = 'Surfer Rosas';
            const updatedName = 'Surfer Ritas';
            const originalBand = await sequelize.query(`SELECT id FROM bands WHERE name = '${originalName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.bandRepo.updateBand(originalBand[0].id, { name : updatedName });

            const updatedBand = await sequelize.query(`SELECT id FROM bands WHERE name = '${updatedName}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            updatedBand[0].id.should.equal(originalBand[0].id);
        });

        it('updateBand() should fail if the session_id provided is invalid', async function() {
            const originalSessionId = 3;
            const updatedSessionId = 100;
            const originalBand = await sequelize.query(`SELECT id FROM bands WHERE session_id = '${originalSessionId}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.bandRepo.updateBand(originalBand[0].id, { session_id: updatedSessionId });
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error: session_id not found');
            }
        });

        it('updateBand() should fail if the artist_id provided is invalid', async function() {
            const originalArtistId = 3;
            const updatedArtistId = 100;
            const originalBand = await sequelize.query(`SELECT id FROM bands WHERE artist_id = '${originalArtistId}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.bandRepo.updateBand(originalBand[0].id, { artist_id: updatedArtistId });
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error: artist_id not found');
            }
        });

        it('updateBand() should fail if the genre_id provided is invalid', async function() {
            const originalGenreId = 3;
            const updatedGenreId = 100;
            const originalBand = await sequelize.query(`SELECT id FROM bands WHERE genre_id = '${originalGenreId}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            try {
                await repositories.bandRepo.updateBand(originalBand[0].id, { genre_id: updatedGenreId });
            } catch (err) {
                err.should.be.an('error');
                err.message.should.equal('Validation error: genre_id not found');
            }
        });

        it('deleteBand() should destroy a band when a valid id is provided', async function() {
            let sessionId = 1;
            let artistId = 2;
            let genreId = 3;
            let name = 'speedo suicide';
            let imageURL = 'http://www.images.com/image.jpg';
            let dayOfWeek = 'Tuesday';
            let startsAt = '20:00:00';
            let endsAt = '21:30:00';
            let price = 200.00;
            let durationWeeks = 8;

            await sequelize.query(`INSERT INTO bands 
                (session_id, artist_id, genre_id, name, image_url, day_of_week, starts_at, ends_at, price, duration_weeks) 
                VALUES 
                (${sessionId}, ${artistId}, ${genreId}, '${name}', '${imageURL}', '${dayOfWeek}', '${startsAt}', '${endsAt}', ${price}, ${durationWeeks});`,
                { type: QueryTypes.INSERT });
            const band = await sequelize.query(`SELECT id FROM bands WHERE name = '${name}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            await repositories.bandRepo.deleteBand(band[0].id);

            const check = await sequelize.query(`SELECT id FROM bands WHERE name = '${name}' LIMIT 1;`,
                { type: QueryTypes.SELECT });

            expect(check).to.be.empty;
        });
    });
});