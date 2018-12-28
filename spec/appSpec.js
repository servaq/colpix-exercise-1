const underTest = require('../src/app.js');

describe('Hello world', () => {
	var lambdaContextSpy;

	beforeEach(() => {
		lambdaContextSpy = jasmine.createSpyObj('lambdaContext', ['done']);
	});

	it('returns status OK with GET', (done) => {
		underTest.proxyRouter({
			requestContext: {
				resourcePath: '/hello',
				httpMethod: 'GET'
			},
			// queryStringParameters: {
			// 	'hub.verify_token': '12345',
			// 	'hub.challenge': 'XHCG'
			// },
			stageVariables: {
				facebookVerifyToken: '12345'
			}
		}, lambdaContextSpy).then(() => {
			let result = {
				statusCode: 200,
				body: JSON.stringify({
					"status": "OK",
					"body": "",
					"pathParams": {},
					"query": {}
				}),
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining(result));
		}).then(done, done.fail);
	});

	it('returns status OK with POST', (done) => {
		underTest.proxyRouter({
			requestContext: {
				resourcePath: '/hello',
				httpMethod: 'POST'
			},
			// queryStringParameters: {
			// 	'hub.verify_token': '12345',
			// 	'hub.challenge': 'XHCG'
			// },
			body: {
				field1: "data1",
			},
			stageVariables: {
				facebookVerifyToken: '12345'
			}
		}, lambdaContextSpy).then(() => {
			let result = {
				statusCode: 200,
				body: JSON.stringify({
					status: "OK",
					body: {
						field1: "data1",
					},
					pathParams: {},
					query: {}
				}),
			}
			expect(lambdaContextSpy.done).toHaveBeenCalledWith(null, jasmine.objectContaining(result));
		}).then(done, done.fail);
	});
});