const db = require("../db/connection");

exports.checkArticleExists = (article_id) => {
    return db
        .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "404: Article Not Found",
                });
            }
        });
};

exports.selectArticles = () => {
    return db
        .query(
            `SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
FROM articles
LEFT JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectArticleById = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "404: Not Found",
                });
            }
            return rows[0];
        });
};

exports.editArticleById = (article_id, inc_votes) => {
    // if (!inc_votes) {
    //     return Promise.reject({
    //         status: 400,
    //         msg: "400: Required Key Missing",
    //     });
    // }
    return db
        .query(
            "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
            [inc_votes, article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "404: Not Found",
                });
            }
            return rows[0];
        });
};
