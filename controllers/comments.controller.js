const { checkArticleExists } = require("../models/articles.model");
const { selectUserByUsername } = require("../models/users.model");
const {
	selectCommentsByArticleId,
	insertCommentByArticleId,
	removeCommentById,
	editCommentById,
} = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	checkArticleExists(article_id)
		.then(() => {
			return selectCommentsByArticleId(article_id);
		})
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const { username, body } = req.body;

	Promise.all([
		selectUserByUsername(username),
		checkArticleExists(article_id),
	])
		.then(() => {
			return insertCommentByArticleId(article_id, username, body);
		})
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;

	removeCommentById(comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};

exports.patchCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;
	editCommentById(comment_id, inc_votes)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};
