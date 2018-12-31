const ApiBuilder = require('claudia-api-builder');
const ApiBuilderHelper = require('./helpers/ApiBuilderHelper');
const LoginController = require('./controllers/LoginController');
const EmployeeController = require('./controllers/EmployeeController');

const api = new ApiBuilder();
module.exports = api;

const routesWithoutAuth = [
	'/login',
]

api.intercept(req => ApiBuilderHelper.beforeRequest(api, req, routesWithoutAuth));

api.post('/login', req => LoginController.postLogin(api, req));

api.get('/employees', req => EmployeeController.getList(api, req));
api.get('/employees/:id', req => EmployeeController.get(api, req));
api.get('/employees/supervisor/:id', req => EmployeeController.getListForSupervisor(api, req));

api.addPostDeployConfig('environment', 'Environment name:', 'environment');
