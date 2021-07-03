const mariadb = require('mariadb');
const { getDb, initDb, runMigrations } = require('../src/database/db');
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

    // seed sessions
    await sequelize.query(`INSERT INTO sessions (started_at, showcased_at, showcase_location) 
        VALUES ('2021-01-01', '2021-03-01 03:00:00', 'Hole in the Wall')`);
    await sequelize.query(`INSERT INTO sessions (started_at, showcased_at, showcase_location) 
        VALUES ('2020-10-01', '2020-12-01 03:00:00', 'Mohawk')`);
    await sequelize.query(`INSERT INTO sessions (started_at, showcased_at, showcase_location) 
        VALUES ('2019-03-01', '2019-05-01 03:00:00', 'Speakeasy')`);

    // seed bands
    await sequelize.query(`INSERT INTO bands 
        (session_id, artist_id, genre_id, name, image_url, day_of_week, starts_at, ends_at, price, duration_weeks) 
        VALUES (1, 1, 1, 'Surfer Rosas', 'logo1.jpg', 'Monday', '20:00:00', '21:30:00', 200.00, 8)`);
    await sequelize.query(`INSERT INTO bands 
        (session_id, artist_id, genre_id, name, image_url, day_of_week, starts_at, ends_at, price, duration_weeks) 
        VALUES (2, 2, 2, 'Deftwats', 'logo2.jpg', 'Thursday', '19:00:00', '20:30:00', 200.00, 8)`);
    await sequelize.query(`INSERT INTO bands 
        (session_id, artist_id, genre_id, name, image_url, day_of_week, starts_at, ends_at, price, duration_weeks) 
        VALUES (3, 3, 3, 'Courtney Did It', 'logo3.jpg', 'Tuesday', '20:00:00', '21:30:00', 2000.00, 8)`);
}

async function destroy() {
    // destroy db once all tests have been run
    const connection = await mariadb.createConnection({ host, port, user, password });
    await connection.query(`DROP DATABASE IF EXISTS bandManagerTest;`);
}
