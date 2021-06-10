const mariadb = require('mariadb');
const { getDb, initDb, runMigrations } = require('../src/db');
const { testDb: { host, port, user, password } } = require('../config');

exports.mochaGlobalSetup = async function() {
    await initialize().then(() => {
        console.log('Test database created')
    });
};

exports.mochaGlobalTeardown = async() => {
    await destroy().then(() => {
        console.log('Test database destroyed');
    });
};

async function initialize() {
    // create test db
    const connection = await mariadb.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS bandManagerTest;`);

    // initialize test db
    await initDb(host, user, password, 'bandManagerTest');

    // run migrations
    await runMigrations(getDb()).then(() => {
        console.log('migrations run');
    });
}

async function destroy() {
    // destroy db once all tests have been run
    const connection = await mariadb.createConnection({ host, port, user, password });
    await connection.query(`DROP DATABASE IF EXISTS bandManagerTest;`);
}
