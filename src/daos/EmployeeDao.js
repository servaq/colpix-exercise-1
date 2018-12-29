const Database = require('../helpers/Database');

class EmployeeDao {

	async getAll() {
		let result = await Database.getDb().table('employees')
				.select();
		return result;
	}

}

module.exports = new EmployeeDao();