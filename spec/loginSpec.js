const lambdaTest = require('./helpers/lambdaTest');
const config = require('./config');
const app = require('../src/app.js');

describe('Login', () => {
	let lambdaContextSpy;

	beforeEach(() => {
		lambdaContextSpy = jasmine.createSpyObj('lambdaContext', ['done']);
	});

	it('Login fail because no user/pass', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/login',
				httpMethod: 'POST'
			},
			body: {
			},
			stageVariables: {
				environment: config.environment,
			},
		}, lambdaContextSpy).then(() => {
			const bodyTestCallback = (body) => {
				if (body.success) {
					throw new Error('Property "success" must be FALSE');
				}
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(401, bodyTestCallback));
		}).then(done, done.fail);
	});

	it('Login fail because invalid user/pass', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/login',
				httpMethod: 'POST'
			},
			body: {
				username: '',
				password: '',
			},
			stageVariables: {
				environment: config.environment
			},
		}, lambdaContextSpy).then(() => {
			const bodyTestCallback = (body) => {
				if (body.success) {
					throw new Error('Property "success" must be FALSE');
				}
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(401, bodyTestCallback));
		}).then(done, done.fail);
	});

	it('Login fail because valid user but invalid pass', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/login',
				httpMethod: 'POST'
			},
			body: {
				username: config.username,
				password: '',
			},
			stageVariables: {
				environment: config.environment
			},
		}, lambdaContextSpy).then(() => {
			const bodyTestCallback = (body) => {
				if (body.success) {
					throw new Error('Property "success" must be FALSE');
				}
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(401, bodyTestCallback));
		}).then(done, done.fail);
	});

	it('Login OK', (done) => {
		app.proxyRouter({
			requestContext: {
				resourcePath: '/login',
				httpMethod: 'POST'
			},
			body: {
				username: config.username,
				password: config.password,
			},
			stageVariables: {
				environment: config.environment
			},
		}, lambdaContextSpy).then(() => {
			const bodyTestCallback = (body) => {
				if (!body.success) {
					throw new Error('Property "success" must be TRUE');
				}
				if (body.token == null || body.token == '') {
					throw new Error('Property "token" must be filled');
				}
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, lambdaTest(200, bodyTestCallback));
		}).then(done, done.fail);
	});

});