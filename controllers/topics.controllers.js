const {
  fetchAllEndpoints,
  fetchAllTopics,
} = require("../models/topics.models");

exports.getAllEndpoints = (req, res) => {
  const allEndpoints = fetchAllEndpoints();
  res.status(200).send({ endpoints: allEndpoints });
};

exports.getAllTopics = (req, res) => {
  fetchAllTopics().then(({ rows }) => {
    res.status(200).send({ topics: rows });
  });
};
