const db = require('../db/connection');
const endpoints = require('../endpoints.json')

exports.fetchAllEndpoints = () => {
  return endpoints;
}

exports.fetchAllTopics = () => {
  return db.query('SELECT * FROM topics');
}