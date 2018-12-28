const configs = {
	dev: {
		token: {
			secret: '',
			ttlSeconds: 300,
		},
		database: {
			client: 'mysql',
			connection: {
				host: 'localhost',
				user: 'root',
				password: 'root',
				database: 'colpix-e1',
				charset: 'utf8',
				timezone: '-03:00',
			}
		}
	},
	prod: {
		token: {
			secret: '',
			ttlSeconds: 300,
		},
		database: {
			client: 'mysql',
			connection: {
				host: '',
				user: '',
				password: '',
				database: 'colpix-e1',
				charset: 'utf8',
				timezone: '-03:00',
			}
		}
	}
}

module.exports.getConfig = (environment) => {
	return configs[environment];
}