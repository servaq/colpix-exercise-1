const Database = require('../helpers/Database');

class EmployeeDao {

	async getAll() {
		return await Database.getDb().table('employees')
				.select();
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
		return await Database.getDb().table('employees')
				.where('supervisor_id', supervisorId)
				.select();
	}

	async save(item) {
		const table = Database.getDb().table('employees');
		if (item.id) {
			return await table.where('id', item.id).update(item);
		} else {
			return await table.insert(item);
		}
	}

	async delete(id) {
		return await Database.getDb().table('employees')
				.where('id', id)
				.del();
	}

}

module.exports = new EmployeeDao();