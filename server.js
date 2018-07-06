'use strict';

require('dotenv').config();
const express = require('express'),
  mysql = require('mysql'),
  path = require('path'),
  app = express(),
  PORT = 3000;
app.use(express.static(__dirname));
app.use(express.json());
app.use('/src', express.static('src'));
app.use('/assets', express.static('assets'));
app.use('/scripts', express.static('scripts'));
app.use('/styles', express.static('styles'));
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'login.html'));
});

app.get('/:user', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
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

// SQL command that created the database:
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
  let sql = 'SELECT * FROM posts WHERE id = ?;';

  conn.query(sql, req.params.id, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send();
      return;
    }

    sql = `DELETE FROM posts WHERE id = ?;`;

    conn.query(sql, req.params.id, err => {
      if (err) {
        console.error(err);
        res.status(500).send();
        return;
      }

      res.json({
        rows,
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

    sql = `SELECT * FROM posts WHERE id = ${rows.insertId};`;
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

app.put('/api/posts/:id/upvote', (req, res) => {
  let sql = `
  UPDATE posts
    SET score = CASE WHEN vote != '+1' THEN score + 1 ELSE score - 1 END,
        vote = CASE WHEN vote != '+1' THEN '+1' ELSE '0' END
  WHERE (id = ?);`;

  conn.query(sql, req.params.id, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send();
      return;
    }

    sql = `SELECT * FROM posts WHERE id = ?;`;
    conn.query(sql, req.params.id, (err, rows) => {
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

app.put('/api/posts/:id/downvote', (req, res) => {
  let sql = `
  UPDATE posts
    SET score = CASE WHEN vote != '-1' THEN score - 1 ELSE score + 1 END,
        vote = CASE WHEN vote != '-1' THEN '-1' ELSE '0' END
  WHERE (id = ?);`;

  conn.query(sql, req.params.id, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send();
      return;
    }

    sql = `SELECT * FROM posts WHERE id = ?;`;
    conn.query(sql, req.params.id, (err, rows) => {
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
