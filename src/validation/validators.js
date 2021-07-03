const { QueryTypes } = require('sequelize');

async function exists(sequelize, table, id) {
    const object = await sequelize.query('SELECT id FROM ' + table + ' WHERE id = ? LIMIT 1',
        {
            replacements: [ id ],
            type: QueryTypes.SELECT
        }
    );

    try {
        return object[0].id;
    } catch (err) {
        return false;
    }
}

module.exports = {
    exists
}