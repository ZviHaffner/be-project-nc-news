const commentsRouter = require("express").Router();
const { eraseCommentById } = require("../controllers/comments.controllers");

commentsRouter.route("/:comment_id").delete(eraseCommentById);

module.exports = commentsRouter;
