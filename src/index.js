const { MongoClient } = require('mongodb');
const assert = require('assert');
const express = require('express');
const mongoose = require('mongoose');
const { getPages } = require('./controllers/get');
const { PORT, HOST } = require('./constants');

const { getMovies } = require('./api/movies');
const { URL } = require('./constants');

const { Schema } = mongoose;

const page = 1;

const movieScheme = new Schema({
  title: String,
  overview: String,
});

mongoose.connect('mongodb://localhost:27017/usersdb', { useNewUrlParser: true });

const Movie = mongoose.model('Movie', movieScheme);

getMovies({ page, URL })
  .then(({ movies }) => {
    movies.map(res => {
      const { title, overview } = res;
      Movie.create(new Movie({ title, overview }), (err, doc) => {
        mongoose.disconnect();
        if (err) return console.log(err);

        console.log('Сохранен объект user', doc);
      });
    });
  })
  .catch(e => {
    console.log(e);
  });

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'ilona';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect((err) => {
  assert.equal(null, err);
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  client.close();
});

const app = express();
app.get('/', (req, res) => {
  getPages(req, res);
}).listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
