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

app.get('/api/users', (req, res) => {
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

//CREATE TABLE posts (id int AUTO_INCREMENT NOT NULL, title varchar(50) NOT NULL, url varchar(255) NOT NULL, timestamp int NOT NULL, score int NOT NULL, owner varchar(20), vote ENUM ('-1', '0', '+1') DEFAULT '0', primary key (id));

app.get('/api/posts', (req, res) => {
  let sql = 'SELECT * FROM posts;';

  conn.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send();
      return;
    }

    res.json({
      posts: rows,
    });
  });
});

app.delete('/api/posts/:id', (req, res) => {
  let sql = 'SELECT * FROM posts WHERE id=?;';

  conn.query(sql, req.params.id, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send();
      return;
    }

    const deleted = rows;
    sql = 'DELETE FROM posts WHERE id=?;';

    conn.query(sql, req.params.id, err => {
      if (err) {
        console.error(err);
        res.status(500).send();
        return;
      }

      res.json({
        deleted,
      });
    });
  });
});

app.post('/api/posts', (req, res) => {
  let sql = `INSERT INTO posts (title, url, timestamp, owner) VALUE ("${req.body.title}", "${req.body.url}", unix_timestamp(), "${req.body.owner}");`;

  conn.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send();
      return;
    }

    sql = `SELECT * FROM posts WHERE ID = ${rows.insertId};`;
    conn.query(sql, (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send();
        return;
      }

      res.json({
        posts: rows,
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
