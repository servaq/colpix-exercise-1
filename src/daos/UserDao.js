const Database = require('../helpers/Database');

class UserDao {

	async getUser(username) {
		let result = await Database.getDb().table('users')
				.where('username', username)
				.select();
		return result.length == 1 ? result[0] : null;
	}

}

module.exports = new UserDao();