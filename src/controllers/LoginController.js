const Config = require('../Config');
const Auth = require('../helpers/Auth');
const ApiBuilderHelper = require('../helpers/ApiBuilderHelper');

class LoginController {

	async postLogin(api, req) {
		const conf = Config.getConfig(req.env.environment);
		const username = req.body.username || '';
		const password = req.body.password || '';
		let token = null;
		try {
			token = await Auth.login(username, password, conf.token);
		} catch (error) {
			console.log(error);
			const body = {
				success: false,
				message: 'Authentication failed',
			}
			throw ApiBuilderHelper.createResponse(body, {}, 401);
		}
		const body = {
			success: true,
			username: username,
			token: token,
		}
		return ApiBuilderHelper.createResponse(api, body, {}, 200);
	}

}

module.exports = new LoginController();