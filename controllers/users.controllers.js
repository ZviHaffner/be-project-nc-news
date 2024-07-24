const {
  fetchAllUsers,
  fetchUserByUsername,
} = require("../models/users.models");

exports.getAllUsers = (req, res) => {
  fetchAllUsers().then(({ rows }) => {
    res.status(200).send({ users: rows });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
