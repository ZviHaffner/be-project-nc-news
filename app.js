const express = require('express');
const app = express();
const { getAllEndpoints, getAllTopics } = require('./controllers/topics.controllers')

app.get('/api', getAllEndpoints)

app.get('/api/topics', getAllTopics)

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
});

app.all('*', (req, res) => {
  res.status(404).send({msg: "Route not found"})
    })

module.exports = app;