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
			throw await ApiBuilderHelper.createResponse(api, body, {}, 401);
		}
		const body = {
			success: true,
			username: username,
			token: token,
		}
		return await ApiBuilderHelper.createResponse(api, body, {}, 200);
	}

}

module.exports = new LoginController();