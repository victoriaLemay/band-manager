const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage, MigrationMeta } = require('umzug');

/**
 * Get the handle for the database connection
 *
 * @returns {*}
 */
function getDb() {
    if (this.db) {
        return this.db;
    }
    throw new Error('The database has not been initialized.');
}

/**
 * Initialize Sequelize and authenticate with the database parameters
 *
 * @param dbHost
 * @param dbUser
 * @param dbPassword
 * @param dbName
 * @param withMigrations
 *
 * @returns {Promise<void>}
 */
async function initDb(dbHost, dbUser, dbPassword, dbName, withMigrations = false) {
    const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: 'mariadb'
    });

    return await sequelize.authenticate()
        .then((connectionStatus) => {
            console.log('Connected to database');

            this.db = sequelize;

            if (withMigrations) {
                runMigrations(sequelize);
            }
        })
        .catch (err => {
            console.log('Failed to connect: ' + err);
        });
}

/**
 * Run Umzug migrations
 *
 * @param sequelize
 *
 * @returns {Promise<MigrationMeta[]>}
 */
async function runMigrations(sequelize) {
    const umzug = new Umzug({
        migrations: { glob: 'src/database/migrations/*.js' },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
    });

    return await umzug.up();
}

module.exports = {
    getDb,
    initDb,
    runMigrations
}