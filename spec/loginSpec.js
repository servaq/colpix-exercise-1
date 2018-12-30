const underTest = require('../src/app.js');
const lambdaTest = require('./helpers/lambdaTest');

describe('Login', () => {
	let lambdaContextSpy;

	beforeEach(() => {
		lambdaContextSpy = jasmine.createSpyObj('lambdaContext', ['done']);
	});

	it('Login fail because no user/pass', (done) => {
		underTest.proxyRouter({
			requestContext: {
				resourcePath: '/login',
				httpMethod: 'POST'
			},
			body: {
			},
			stageVariables: {
				environment: 'dev'
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
		underTest.proxyRouter({
			requestContext: {
				resourcePath: '/login',
				httpMethod: 'POST'
			},
			body: {
				username: '',
				password: '',
			},
			stageVariables: {
				environment: 'dev'
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
		underTest.proxyRouter({
			requestContext: {
				resourcePath: '/login',
				httpMethod: 'POST'
			},
			body: {
				username: 'admin',
				password: '',
			},
			stageVariables: {
				environment: 'dev'
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
		underTest.proxyRouter({
			requestContext: {
				resourcePath: '/login',
				httpMethod: 'POST'
			},
			body: {
				username: 'admin',
				password: 'admin',
			},
			stageVariables: {
				environment: 'dev'
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