// Update with your config settings.
import haha from "./data/migrations";
module.exports = {
	development: {
		client: "sqlite",
		connection: {
			filename: "./data/eventHorizon.db3",
		},
		useNullAsDefault: true,
		migrations: {
			directory: "./data/migrations",
		},
		seeds: {
			directory: "./data/seeds",
		},
		pool: {
			afterCreate: (conn, done) => {
				conn.run("PRAGMA foreign_keys = ON", done);
			},
		},
	},

	staging: {
		client: "postgresql",
		connection: {
			database: "my_db",
			user: "username",
			password: "password",
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},

	// production: {
	// 	client: "sqlite",
	// 	connection: {
	// 		filename: "./data/eventHorizon.db3",
	// 	},
	// 	useNullAsDefault: true,
	// 	migrations: {
	// 		directory: "./data/migrations",
	// 	},
	// 	seeds: {
	// 		directory: "./data/seeds",
	// 	},
	// 	pool: {
	// 		afterCreate: (conn, done) => {
	// 			conn.run("PRAGMA foreign_keys = ON", done);
	// 		},
	// 	},
	// },
	production: {
		client: "pg",
		connection: process.env.DATABASE_URL,
		pool: {
			min: 2,
			max: 10,
		},
		useNullAsDefault: true,
		migrations: {
			directory: "./data/migrations",
		},
		seeds: {
			directory: "./data/seeds",
		},
		pool: {
			afterCreate: (conn, done) => {
				conn.run("PRAGMA foreign_keys = ON", done);
			},
		},
	},
};
