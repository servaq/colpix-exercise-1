const sha1 = require('sha1');
const jwt = require('jsonwebtoken');
const UserDao = require('../daos/UserDao');

class Auth {

	_createToken(userId, userName, tokenConfig) {
		const tokenPayload = {
			exp: Math.floor((Date.now() / 1000) + tokenConfig.ttlSeconds),
			user: {
				id: userId,
				username: userName,
			},
		}
		return jwt.sign(tokenPayload, tokenConfig.secret);
	}

	async login(username, password, tokenConfig) {
		let user = await UserDao.getUser(username);
		if (user == null) {
			throw new Error('Invalid username');
		}
		if (user.password != sha1(password)) {
			throw new Error('Invalid password');
		}
		return this._createToken(user.id, user.username, tokenConfig);
	}

	validateToken(token, tokenConfig) {
		if (token.startsWith('Bearer ')) {
			token = token.substring(7);
		}
		try {
			jwt.verify(token, tokenConfig.secret);
		} catch (error) {
			throw new Error('Token expired');
		}
	}

}

module.exports = new Auth();