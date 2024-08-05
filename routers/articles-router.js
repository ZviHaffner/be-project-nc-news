const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
  addCommentByArticle,
  updateArticleById,
  addArticle,
} = require("../controllers/articles.controllers");

articlesRouter.route("/").get(getAllArticles).post(addArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(addCommentByArticle);

module.exports = articlesRouter;
