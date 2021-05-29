const { initDb } = require('./db');
const { db: { host, user, password, name } } = require('../config');

initDb(host, user, password, name);

