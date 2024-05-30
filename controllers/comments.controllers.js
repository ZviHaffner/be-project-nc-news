const { deleteCommentByID } = require("../models/comments.models");

exports.eraseCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByID(comment_id)
  .then(() => {
      res.status(204)
      res.end()
  })
  .catch(next)
};
