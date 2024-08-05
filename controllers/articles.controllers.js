const { promises } = require("supertest/lib/test");
const {
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticle,
  insertCommentByArticle,
  updateVotesByArticle,
  insertArticle,
} = require("../models/articles.models");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, filter_by } = req.query;
  fetchAllArticles(sort_by, order, filter_by)
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
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

exports.addCommentByArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const newComment = req.body;
  insertCommentByArticle(newComment, articleId)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesByArticle(inc_votes, article_id)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then((article) => {
      res.status(201).send({ article: { ...article, comment_count: 0 } });
    })
    .catch(next);
};
