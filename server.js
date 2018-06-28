'use strict';

require('dotenv').config();
const express = require('express'),
  mysql = require('mysql'),
  path = require('path'),
  app = express(),
  PORT = 3000;
app.use(express.static(__dirname));
app.use(express.json());
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.get('/', (req, res) => {
  res.sendFile(__dirname, './index.html');
});

app.get('/hello', (req, res) => {
  res.send('Hello world');
});

app.get('/api/user.json', (req, res) => {
  let sql = 'SELECT * FROM user;';

  conn.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send();
      return;
    }

    res.json({
      user_data: rows,
    });
  });
});

app.get('/api/post.json', (req, res) => {
  let sql = 'SELECT * FROM post;';

  conn.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send();
      return;
    }

    res.json({
      post_data: rows,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
