const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
    return db
        .query(
            "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
            [article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "404: Not Found",
                });
            }
            return rows;
        });
};

exports.insertCommentByArticleId = (article_id, username, body) => {
    if (!body || body === "") {
        return Promise.reject({
            status: 400,
            msg: "400: Required Key Missing",
        });
    }
    return db
        .query("SELECT username FROM users WHERE username = $1;", [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "404: User Not Found",
                });
            }
            return db
                .query("SELECT * FROM articles WHERE article_id = $1;", [
                    article_id,
                ])
                .then(({ rows }) => {
                    if (rows.length === 0) {
                        return Promise.reject({
                            status: 404,
                            msg: "404: Not Found",
                        });
                    }
                    return db
                        .query(
                            "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
                            [article_id, username, body]
                        )
                        .then(({ rows }) => {
                            return rows[0];
                        });
                });
        });
};
