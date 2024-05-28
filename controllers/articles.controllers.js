const { fetchArticleById } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};