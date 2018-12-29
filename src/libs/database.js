const Knex = require('knex');

var dbConfig = null;
var knexCache = null;

const getDb = () => {
	if (knexCache == null) {
		if (dbConfig == null) {
			throw new Error('Database lib not initialized!');
		}
		knexCache = Knex(dbConfig);
	}
	return knexCache;
}

module.exports.init = (config) => {
	dbConfig = config;
}

module.exports.exit = async () => {
	return await getDb().destroy();
}

module.exports.getEmployees = async () => {
	let result = await getDb().table('employees')
			.select();
	return result;
}
