const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
	path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
	throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};

if (ENV === "production") {
	config.connectionString = process.env.DATABASE_URL;
	config.max = 2;
} else {
	config.database = process.env.PGDATABASE;
	config.host = process.env.PGHOST || "localhost";
	config.port = process.env.PGPORT || 5432;
	config.user = process.env.PGUSER || "postgres";
	config.password = process.env.PGPASSWORD;
}

module.exports = new Pool(config);
