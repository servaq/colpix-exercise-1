const Database = require('../helpers/Database');

class EmployeeDao {

	async getAll() {
		let result = await Database.getDb().table('employees')
				.select();
		return result;
	}

	async get(id) {
		let result = await Database.getDb().table('employees')
				.where('id', id)
				.select();
		return result.length == 1 ? result[0] : null;
	}

	async getCountForSupervisor(supervisorId) {
		let result = await Database.getDb()('employees')
				.where('supervisor_id', supervisorId)
				.count({total: 1});
		return result[0].total;
	}

	async getForSupervisor(supervisorId) {
		let result = await Database.getDb().table('employees')
				.where('supervisor_id', supervisorId)
				.select();
		return result;
	}

}

module.exports = new EmployeeDao();