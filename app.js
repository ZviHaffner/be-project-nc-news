const express = require("express");
const app = express();
const {
  getAllEndpoints,
  getAllTopics,
} = require("./controllers/topics.controllers");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
  addCommentByArticle,
  updateArticleById,
} = require("./controllers/articles.controllers");
const { eraseCommentById } = require("./controllers/comments.controllers");
const { getAllUsers } = require("./controllers/users.controllers");

app.use(express.json());

app.get("/api", getAllEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.post("/api/articles/:article_id/comments", addCommentByArticle);

app.patch("/api/articles/:article_id", updateArticleById);

app.delete("/api/comments/:comment_id", eraseCommentById);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
