const Database = require('../helpers/Database');

class Employee {

	async getAll() {
		let result = await Database.getDb().table('employees')
				.select();
		return result;
	}

}

module.exports = new Employee();