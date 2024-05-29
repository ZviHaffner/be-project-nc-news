const db = require("../db/connection");

exports.fetchAllArticles = () => {
  return db.query(`
  SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC
  `);
};

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
