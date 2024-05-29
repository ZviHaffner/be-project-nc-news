const {
  fetchAllArticles,
  fetchArticleById,
} = require("../models/articles.models");

exports.getAllArticles = (req, res) => {
  fetchAllArticles().then((result) => {
    res.status(200).send({ articles: result.rows });
  });
};

exports.getArticleById = (req, res, next) => {
  articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
