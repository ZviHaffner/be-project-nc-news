const commentsRouter = require("express").Router();
const {
  eraseCommentById,
  patchCommentVotesById,
} = require("../controllers/comments.controllers");

commentsRouter
  .route("/:comment_id")
  .delete(eraseCommentById)
  .patch(patchCommentVotesById);

module.exports = commentsRouter;
