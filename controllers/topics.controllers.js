const { fetchAllTopics } = require("../models/topics.models");

exports.getAllTopics = (req, res) => {
  fetchAllTopics().then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
};
