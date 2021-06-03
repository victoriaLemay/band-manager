const { initDb } = require('./db');
const { db: { host, user, password, name } } = require('../config');

let repositories

initDb(host, user, password, name).then(() => {
    const repositories = require('./repositories/repositories');

    repositories.artistRepo.createNewArtist(null).then((result) => {
        console.log('new artist id: ' + result.id);
    })
});

module.exports = {
    repositories
}




