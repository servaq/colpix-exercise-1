const Knex = require('knex');

class Database {

	init(config) {
		this.dbConfig = config;
		this.knexCache = null;
	}

	async disconnect() {
		if (this.knexCache != null) {
			return await this._getDb().destroy();
		}
	}

	getDb() {
		if (this.knexCache == null) {
			this.knexCache = new Knex(this.dbConfig);
		}
		return this.knexCache;
	}

}

module.exports = new Database();