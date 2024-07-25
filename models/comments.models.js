const db = require("../db/connection");

exports.deleteCommentByID = (commentId) => {
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *
  `,
      [commentId]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${commentId}`,
        });
      }
      return result;
    });
};

exports.updateCommentVotesById = (newVotes, commentId) => {
  return db
    .query(
      `
      UPDATE comments
      SET
        votes = votes + $1
      WHERE comment_id = $2
      RETURNING *;`,
      [newVotes, commentId]
    )
    .then(({ rows }) => {
      const updatedComment = rows;
      if (!updatedComment.length) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${commentId}`,
        });
      }
      return updatedComment[0];
    });
};
