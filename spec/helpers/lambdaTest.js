module.exports = (expectedStatusCode, bodyTestCallback, headersTestCallback) => {
	return {
		asymmetricMatch: function(resultToTest) {
			if (expectedStatusCode) {
				if (resultToTest.statusCode != expectedStatusCode) {
					throw new Error('Invalid StatusCode, expected ' + expectedStatusCode + ', actual ' + resultToTest.statusCode);
				}
			}
			if (bodyTestCallback) {
				bodyTestCallback(resultToTest.body && JSON.parse(resultToTest.body) || null);
			}
			if (headersTestCallback) {
				headersTestCallback(resultToTest.headers && JSON.parse(resultToTest.headers) || null);
			}
			return true;
		},
		jasmineToString: function() {
			return '<lambdaTest: FAIL>';
		}
	}
}
