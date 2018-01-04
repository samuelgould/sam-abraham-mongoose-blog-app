'use strict';

const express = require('express');
const router = express.Router();

const { DATABASE } = require('../config');
const knex = require('knex')(DATABASE);

var data = require('../db/dummy-data');

// const { DATABASE } = require('../config');
// const knex = require('knex')(DATABASE);

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res) => {
  if (req.query.search) {
    knex.select('id', 'title', 'content')
      .from('stories')
      .then(result => res.json(result.filter((obj) => obj.title.includes(req.query.search))));
  } else {
    knex.select('id', 'title', 'content')
      .from('stories')
      .then(result => res.json(result));
  }
});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res) => {
  const id = Number(req.params.id);
  knex.select('id', 'title', 'content')
    .from('stories')
    .where('id', id)
    .then(result => res.json(result));
});

/* ========== POST/CREATE ITEM ========== */
router.post('/stories', (req, res) => {
  const { title, content } = req.body;
  /***** Never Trust Users! *****/
  const newItem = {
    title: title,
    content: content
  };
  knex('stories')
    .insert(newItem)
    .returning(['id', 'title', 'content'])
    .then(result => res.location(`${req.originalUrl}/${result[0].id}`).status(201).json(result));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res) => {
  const { title, content } = req.body;

  /***** Never Trust Users! *****/

  const id = Number(req.params.id);
  const item = data.find((obj) => obj.id === id);
  Object.assign(item, { title, content });
  res.json(item);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = data.findIndex((obj) => obj.id === id);
  data.splice(index, 1);
  res.status(204).end();
});

module.exports = router;