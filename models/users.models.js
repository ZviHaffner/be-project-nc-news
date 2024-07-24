const db = require("../db/connection");

exports.fetchAllUsers = () => {
  return db.query("SELECT * FROM users");
};

exports.fetchUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      const user = rows[0];
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: `No user found for username: ${username}`,
        });
      }
      return user;
    });
};
