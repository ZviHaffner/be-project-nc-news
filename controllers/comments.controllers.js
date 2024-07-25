const { deleteCommentByID, updateCommentVotesById } = require("../models/comments.models");

exports.eraseCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByID(comment_id)
  .then(() => {
      res.status(204)
      res.end()
  })
  .catch(next)
};

exports.patchCommentVotesById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentVotesById(inc_votes, comment_id)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};
