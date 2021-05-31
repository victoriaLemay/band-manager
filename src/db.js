const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

let _db;

function getDb() {
    if (_db) {
        return _db;
    }

    throw new Error('The database has not been initialized.');
}

function initDb(dbHost, dbUser, dbPassword, dbName) {
    const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: 'mariadb'
    });

    sequelize.authenticate()
        .then((connectionStatus) => {
            console.log('Connected to database');

            const umzug = new Umzug({
                migrations: { glob: 'src/database/migrations/*.js' },
                context: sequelize.getQueryInterface(),
                storage: new SequelizeStorage({ sequelize }),
                logger: console,
            });

            (async () => {
                await umzug.up();
            })();
        })
        .catch (err => {
            console.log('Failed to connect: ' + err);
        });

    _db = sequelize;

    return _db;
}

module.exports = {
    getDb,
    initDb
}