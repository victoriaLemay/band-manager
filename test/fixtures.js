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

    const sequelize = getDb();

    // seed users
    await sequelize.query(`INSERT INTO users (uuid, name, email, description) 
        VALUES ('8fe05626-90fd-4c9e-9a2a-63d0c6c7c19e', 'Test User 1', 'testuser1@email.com', 'New to guitar');`);
    await sequelize.query(`INSERT INTO users (uuid, name, email, description) 
        VALUES ('8fe05626-90fd-4c9e-9a2a-63d0c6c7c19f', 'Test User 2', 'testuser2@email.com', 'New to bass');`);
    await sequelize.query(`INSERT INTO users (uuid, name, email, description) 
        VALUES ('8fe05626-90fd-4c9e-9a2a-63d0c6c7c19g', 'Test User 3', 'testuser3@email.com', 'New to drums');`);
}

async function destroy() {
    // destroy db once all tests have been run
    const connection = await mariadb.createConnection({ host, port, user, password });
    await connection.query(`DROP DATABASE IF EXISTS bandManagerTest;`);
}
