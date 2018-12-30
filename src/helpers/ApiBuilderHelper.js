const Config = require('../Config');
const Database = require('./Database');
const Auth = require('./Auth');

class ApiBuilderHelper {

	beforeRequest(api, req, routesWithoutAuth) {
		if (!req.context) {
			// Invalid request
			return req;
		}
		const conf = Config.getConfig(req.env.environment);
		Database.init(conf.database);
		if (req.context && req.context.path && routesWithoutAuth.includes(req.context.path)) {
			return req;
		} else {
			if (!req.headers.authorization) {
				const body = {
					success: false,
					message: 'Missing authorization header',
				}
				return this.createResponse(api, body, {}, 401);
			}
			try {
				Auth.validateToken(req.headers.authorization, conf.token);
			} catch (error) {
				const body = {
					success: false,
					message: error.message,
				}
				return this.createResponse(api, body, {}, 401);
			}
			return req;
		}
	}

	async createResponse(api, body, headers, statusCode) {
		await Database.disconnect();
		return new api.ApiResponse(body, headers, statusCode);
	}

}

module.exports = new ApiBuilderHelper();