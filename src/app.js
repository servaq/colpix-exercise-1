const ApiBuilder = require('claudia-api-builder');
const Config = require('./Config');
const Database = require('./helpers/Database');
const EmployeeDao = require('./daos/EmployeeDao');
const Auth = require('./helpers/Auth');

const api = new ApiBuilder();

module.exports = api;

const routesWithoutAuth = [
	'/login',
]

const beforeRequest = (req) => {
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
			return new api.ApiResponse(body, {}, 401);
		}
		try {
			Auth.validateToken(req.headers.authorization, conf.token);
		} catch (error) {
			const body = {
				success: false,
				message: error.message,
			}
			return new api.ApiResponse(body, {}, 401);
		}
		return req;
	}
}

const getHello = async (req) => {
	const employees = await EmployeeDao.getAll();
	const body = {
		status: 'OK',
		body: {
			employeesCount: employees.length,
		},
		pathParams: req.pathParams,
		query: req.queryString,
		stageVariables: req.env,
	}
	return new api.ApiResponse(body, {}, 200);
}

const postLogin = async (req) => {
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
		throw new api.ApiResponse(body, {}, 401);
	}
	const body = {
		success: true,
		username: username,
		token: token,
	}
	return new api.ApiResponse(body, {}, 200);
}

api.intercept(beforeRequest);
api.get('/hello', getHello);
api.post('/login', postLogin);

api.addPostDeployConfig('environment', 'Environment name:', 'environment');
