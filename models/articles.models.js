const db = require("../db/connection");

async function fetchAllArticles(
  sortBy = "created_at",
  order = "DESC",
  filterBy
) {
  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`;

  if (filterBy) {
    const validFilterQueries = [];
    const allTopics = await db.query("SELECT slug FROM topics");
    allTopics.rows.forEach((topic) => validFilterQueries.push(topic.slug));
    if (!validFilterQueries.includes(filterBy)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid Filter Query",
      });
    }
    queryString += ` WHERE topic = '${filterBy}'`;
  }

  const validSortQueries = [];
  const allColumns = await db.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'articles';
  `);
  allColumns.rows.forEach((column) =>
    validSortQueries.push(column.column_name)
  );
  if (!validSortQueries.includes(sortBy)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Sort Query",
    });
  }

  const validOrderQueries = ["asc", "desc", "ASC", "DESC"];
  if (!validOrderQueries.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid Order Query",
    });
  }
  queryString += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order}`;

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
}

const fetchArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
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

const insertArticle = (newArticle) => {
  const { author, title, body, topic, article_img_url } = newArticle;
  if (article_img_url) {
    return db
      .query(
        "INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [author, title, body, topic, article_img_url]
      )
      .then(({ rows }) => rows[0]);
  } else {
    return db
      .query(
        "INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *;",
        [author, title, body, topic]
      )
      .then(({ rows }) => rows[0]);
  }
};

module.exports = {
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticle,
  insertCommentByArticle,
  updateVotesByArticle,
  insertArticle,
};
