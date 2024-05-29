const { promises } = require("supertest/lib/test");
const {
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticle,
} = require("../models/articles.models");

exports.getAllArticles = (req, res) => {
  fetchAllArticles().then((result) => {
    res.status(200).send({ articles: result.rows });
  });
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const articleId = req.params.article_id;

  fetchCommentsByArticle(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
