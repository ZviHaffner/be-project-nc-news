const { fetchAllEndpoints } = require("../models/api.models");

exports.getAllEndpoints = (req, res) => {
  const allEndpoints = fetchAllEndpoints();
  res.status(200).send({ endpoints: allEndpoints });
};
