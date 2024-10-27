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

exports.selectArticles = (
	topic,
	sort_by = "created_at",
	order = "desc",
	p,
	limit
) => {
	const validSortBy = ["created_at", "comment_count", "votes", "article_id"];
	const validOrder = ["asc", "desc"];
	const currentPage = p || 1;
	const rowLimit = limit || 10;

	if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
		return Promise.reject({
			status: 400,
			msg: "400: Bad Request",
		});
	}

	let sqlQuery = `
    SELECT 
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
    ON articles.article_id = comments.article_id `;

	const queryValues = [];

	if (topic) {
		sqlQuery += `WHERE topic = $3 `;
		queryValues.push(topic);
	}

	sqlQuery += `
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order.toUpperCase()}
        OFFSET (($1 - 1) * $2) ROWS FETCH NEXT $2 ROW ONLY;
    `;
	queryValues.unshift(currentPage, rowLimit);

	return db.query(sqlQuery, queryValues).then(({ rows }) => {
		return rows;
	});
};

exports.selectArticleById = (article_id) => {
	return db
		.query(
			`SELECT 
                articles.author,
                articles.title,
                articles.article_id,
                articles.body,
                articles.topic,
                articles.created_at,
                articles.votes,
                articles.article_img_url,
                COUNT(comments.comment_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            GROUP BY articles.article_id;`,
			[article_id]
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

exports.editArticleById = (article_id, inc_votes) => {
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
