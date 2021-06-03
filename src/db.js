const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

function getDb() {
    if (this.db) {
        return this.db;
    }
    throw new Error('The database has not been initialized.');
}

async function initDb(dbHost, dbUser, dbPassword, dbName) {
    const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: 'mariadb'
    });

    await sequelize.authenticate()
        .then((connectionStatus) => {
            console.log('Connected to database');

            this.db = sequelize;

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
}

module.exports = {
    getDb,
    initDb
}