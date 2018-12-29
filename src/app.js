const ApiBuilder = require('claudia-api-builder');
const Config = require('./Config.js');
const Database = require('./libs/Database');

const api = new ApiBuilder();

module.exports = api;

let handleGetRequest = async (req) => {
	const conf = Config.getConfig(req.env.environment);
	const database = new Database(conf.database);
	const employees = await database.getEmployees();
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
