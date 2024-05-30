const db = require("../db/connection");

async function fetchAllArticles (filterBy) {
  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`;

  if (filterBy) {
    const allTopics = await db.query('SELECT slug FROM topics')
      const validFilterQueries = [];
      allTopics.rows.forEach(topic => validFilterQueries.push(topic.slug))
      if (!validFilterQueries.includes(filterBy)) {
        return Promise.reject({
          status: 400,
          msg: "Invalid filter query",
        });
      }
      queryString += ` WHERE topic = '${filterBy}'`;
  }

  queryString += " GROUP BY articles.article_id ORDER BY created_at DESC";

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

const fetchArticleById = (articleId) => {
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

const fetchCommentsByArticle = (articleId) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `,
      [articleId]
    )
    .then(({ rows }) => {
      const comments = rows;
      if (!comments.length) {
        return Promise.reject({
          status: 404,
          msg: `No comments found for article_id: ${articleId}`,
        });
      }
      return comments;
    });
};

const insertCommentByArticle = (newComment, articleId) => {
  const { username, body } = newComment;
  return db
    .query(
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;",
      [body, articleId, username]
    )
    .then(({ rows }) => rows[0]);
};

const updateVotesByArticle = (newVotes, articleId) => {
  return db
    .query(
      `
  UPDATE articles
  SET
    votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
      [newVotes, articleId]
    )
    .then(({ rows }) => {
      const updatedArticle = rows;
      if (!updatedArticle.length) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`,
        });
      }
      return updatedArticle[0];
    });
};

module.exports = { fetchAllArticles, fetchArticleById, fetchCommentsByArticle, insertCommentByArticle, updateVotesByArticle }