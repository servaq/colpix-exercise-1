const ApiBuilder = require('claudia-api-builder');
const Config = require('./Config');
const Database = require('./helpers/Database');
const Employee = require('./models/Employee');

const api = new ApiBuilder();

module.exports = api;

let init = (req) => {
	const conf = Config.getConfig(req.env.environment);
	Database.init(conf.database);
}

let handleGetRequest = async (req) => {
	init(req);
	const employees = await Employee.getAll();
	const body = {
		status: 'OK',
		body: {
			employeesCount: employees.length,
		},
		pathParams: req.pathParams,
		query: req.queryString,
		stageVariables: req.env,
	}
	return new api.ApiResponse(body, {
		called: 'handleGetRequest'
	}, 200);
}

api.get('/hello', handleGetRequest);
api.post('/hello', handleGetRequest);

api.addPostDeployConfig('environment', 'Environment name:', 'environment');
