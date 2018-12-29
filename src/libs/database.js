const Knex = require('knex');

module.exports = class Database {

	constructor(config) {
		this.dbConfig = config;
		this.knexCache = null;
	}

	async disconnect() {
		if (this.knexCache != null) {
			return await this._getDb().destroy();
		}
	}

	_getDb() {
		if (this.knexCache == null) {
			this.knexCache = new Knex(this.dbConfig);
		}
		return this.knexCache;
	}

	async getEmployees() {
		let result = await this._getDb().table('employees')
				.select();
		return result;
	}
}