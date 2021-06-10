require('chai').should();

const { getDb } = require('../src/db');

let repositories;
let sequelize;

describe('Artist Method Tests', function() {
    before(() => {
        sequelize = getDb();
        repositories = require('../src/repositories/repositories');

        console.log('ran before code');
    });

    after(function() {
        console.log('ran after code');
    });

    describe('Artist Creation', function() {
        it('should create an artist with a valid name', async function() {
            const artist = await repositories.artistRepo.createNewArtist('AFI');
            artist.should.have.property('name').equal('AFI');
        });
    });
});
