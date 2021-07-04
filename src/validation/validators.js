const { QueryTypes } = require('sequelize');

async function exists(sequelize, table, id) {
    if (id) {
        const object = await sequelize.query('SELECT id FROM ' + table + ' WHERE id = ? LIMIT 1',
            {
                replacements: [id],
                type: QueryTypes.SELECT
            }
        );

        try {
            return object[0].id;
        } catch (err) {
            return false;
        }
    }

    return true;
}

async function multipleKeyUnique(sequelize, table, firstKey, firstValue, secondKey, secondValue) {
    if (secondValue) {
        const object = await sequelize.query(
            'SELECT id FROM ' + table + ' WHERE ' + firstKey + ' = ? AND ' + secondKey + ' = ? LIMIT 1',
            {
                replacements: [ firstValue, secondValue ],
                type: QueryTypes.SELECT
            }
        );

        try {
            return object[0].id;
        } catch (err) {
            return false;
        }
    }

    return false;
}

module.exports = {
    exists,
    multipleKeyUnique
}