const commentsRouter = require("express").Router();
const {
	deleteCommentById,
	patchCommentById,
} = require("../controllers/comments.controller");

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", patchCommentById);

module.exports = commentsRouter;
