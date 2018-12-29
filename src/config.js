const configs = {
	dev: {
		token: {
			secret: 'G7jhnaXTM3QMPvZphZmFGwCe',
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
			secret: 'MYyYZ4F9P4hcCJ9BZDzHs4Ng',
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