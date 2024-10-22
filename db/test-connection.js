const { Pool } = require("pg");
require("dotenv").config({ path: `${__dirname}/.env.test` });

const pool = new Pool();

pool.query("SELECT NOW()", (err, res) => {
	if (err) {
		console.error("Error:", err);
	} else {
		console.log("Connection successful:", res.rows);
	}
	pool.end();
});
