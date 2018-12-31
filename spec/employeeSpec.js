const lambdaTest = require('./helpers/lambdaTest');
const config = require('./config');
const app = require('../src/app');
const appConfig = require('../src/Config');
const Auth = require('../src/helpers/Auth');

describe('Employee', () => {
	let lambdaContextSpy;
	let authorization;
	let randomId1;
	let randomId2;
	let randomName1;
	let randomName2;

	beforeAll(async () => {
		authorization = 'Bearer ' + await Auth._createToken(1, config.username, appConfig.getConfig(config.environment).token);
		const random = Math.floor(Math.random() * 10000);
		randomName1 = random + 'a';
		randomName2 = random + 'b';
	});

	beforeEach(() => {
		lambdaContextSpy = jasmine.createSpyObj('lambdaContext', ['done']);
	});

	it('Get employee list without authorization', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees',
				httpMethod: 'GET'
			},
			body: {
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(401));
		}).then(done, done.fail);
	});

	it('Get employee list', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees',
				httpMethod: 'GET'
			},
			headers: {
				authorization: authorization,
			},
			body: {
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			const bodyTestCallback = (body) => {
				if (!body.items) {
					throw new Error('Missing property "items"');
				}
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(200, bodyTestCallback));
		}).then(done, done.fail);
	});

	it('Get non-existent employee', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees/:id',
				httpMethod: 'GET'
			},
			pathParameters: {
				id: Math.floor(Math.random() * 10000),
			},
			headers: {
				authorization: authorization,
			},
			body: {
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(404));
		}).then(done, done.fail);
	});

	it('Create employee 1 without name', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees',
				httpMethod: 'POST'
			},
			headers: {
				authorization: authorization,
			},
			body: {
				email: 'mail@mail',
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(400));
		}).then(done, done.fail);
	});

	it('Create employee 1', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees',
				httpMethod: 'POST'
			},
			headers: {
				authorization: authorization,
			},
			body: {
				name: randomName1,
				email: 'mail@mail',
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			const bodyTestCallback = (body) => {
				if (!body.id) {
					throw new Error('Invalid "id"');
				}
				if (body.name != randomName1) {
					throw new Error('Invalid "name"');
				}
				randomId1 = body.id;
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(201, bodyTestCallback));
		}).then(done, done.fail);
	});

	it('Get employees for supervisor 1', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees/supervisor/:id',
				httpMethod: 'GET'
			},
			pathParameters: {
				id: randomId1,
			},
			headers: {
				authorization: authorization,
			},
			body: {
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			const bodyTestCallback = (body) => {
				if (body.items.length != 0) {
					throw new Error('Invalid employees count for supervisor ' + randomId1);
				}
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(200, bodyTestCallback));
		}).then(done, done.fail);
	});

	it('Create employee 2', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees',
				httpMethod: 'POST'
			},
			headers: {
				authorization: authorization,
			},
			body: {
				name: randomName2,
				email: 'mail@mail',
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			const bodyTestCallback = (body) => {
				if (!body.id) {
					throw new Error('Invalid "id"');
				}
				if (body.name != randomName2) {
					throw new Error('Invalid "name"');
				}
				randomId2 = body.id;
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(201, bodyTestCallback));
		}).then(done, done.fail);
	});

	it('Update employee 2 with supervisor', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees/:id',
				httpMethod: 'PUT'
			},
			pathParameters: {
				id: randomId2,
			},
			headers: {
				authorization: authorization,
			},
			body: {
				name: randomName2,
				email: 'mail@mail',
				supervisor_id: randomId1,
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			const bodyTestCallback = (body) => {
				if (body.supervisor_id != randomId1) {
					throw new Error('Invalid "supervidor_id"');
				}
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(200, bodyTestCallback));
		}).then(done, done.fail);
	});

	it('Get employees for supervisor 1 again', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees/supervisor/:id',
				httpMethod: 'GET'
			},
			pathParameters: {
				id: randomId1,
			},
			headers: {
				authorization: authorization,
			},
			body: {
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			const bodyTestCallback = (body) => {
				if (body.items.length != 1) {
					throw new Error('Invalid employees count for supervisor ' + randomId1);
				}
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(200, bodyTestCallback));
		}).then(done, done.fail);
	});

	it('Delete employee 1 fail because it is supervisor of employee 2', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees/:id',
				httpMethod: 'DELETE'
			},
			pathParameters: {
				id: randomId1,
			},
			headers: {
				authorization: authorization,
			},
			body: {
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(400));
		}).then(done, done.fail);
	});

	it('Delete employee 2 OK', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees/:id',
				httpMethod: 'DELETE'
			},
			pathParameters: {
				id: randomId2,
			},
			headers: {
				authorization: authorization,
			},
			body: {
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(204));
		}).then(done, done.fail);
	});

	it('Delete employee 1 OK', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/employees/:id',
				httpMethod: 'DELETE'
			},
			pathParameters: {
				id: randomId1,
			},
			headers: {
				authorization: authorization,
			},
			body: {
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(204));
		}).then(done, done.fail);
	});

});