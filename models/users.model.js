const db = require("../db/connection");
const { isUsernameValid } = require("../utils/validation");

exports.selectUsers = () => {
	return db
		.query("SELECT username, name, avatar_url FROM users")
		.then(({ rows }) => {
			return rows;
		})
		.catch((err) => {
			throw err; // Ensures the error is propagated
		});
};

exports.selectUserByUsername = (username) => {
	if (!isUsernameValid(username)) {
		return Promise.reject({
			status: 400,
			msg: "400: Bad Request",
		});
	} else {
		return db
			.query(
				"SELECT username, name, avatar_url FROM users WHERE username = $1;",
				[username]
			)
			.then(({ rows }) => {
				if (rows.length === 0) {
					return Promise.reject({
						status: 404,
						msg: "404: User Not Found",
					});
				}
				return rows[0];
			});
	}
};
