const db = require("../db/connection");

exports.fetchArticleById = (articleId) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1;
  `,
      [articleId]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`,
        });
      }
      return article;
    });
};
