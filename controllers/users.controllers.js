const { fetchAllUsers } = require("../models/users.models");

exports.getAllUsers = (req, res) => {
  fetchAllUsers().then(({ rows }) => {
    res.status(200).send({ users: rows });
  });
};
