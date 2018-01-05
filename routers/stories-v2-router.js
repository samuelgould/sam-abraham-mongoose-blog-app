'use strict';

const express = require('express');
const router = express.Router();

const { DATABASE } = require('../config');
const knex = require('knex')(DATABASE);

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res, next) => {
  if (req.query.search) {
    knex.select('id', 'author_id', 'title', 'content')
      .from('stories')
      .then(result => res.json(result.filter((obj) => obj.title.includes(req.query.search))));
  } else {
    knex('stories')
      .join('authors', 'authors.id', '=', 'stories.author_id')
      .select('stories.id', 'authors.username', 'stories.title', 'stories.content')
      .then(result => {
        if (result) {
          res.json(result);
        } else {
          next();
        }
      })
      .catch(next);
  }
});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res, next) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    const err = new Error('Id must be a valid integer');
    err.status = 400;
    return next(err);
  }

  knex.first('id', 'title', 'content')
    .from('stories')
    .where('id', id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== POST/CREATE ITEM ========== */
router.post('/stories', (req, res, next) => {
  const { title, content } = req.body;

  if (!req.body.title) {
    const err = new Error('Request must contain a title');
    err.status = 400;
    return next(err);
  }

  const newItem = {
    title: title,
    content: content
  };
  knex('stories')
    .insert(newItem)
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      if (result) {
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res, next) => {
  const { title, content } = req.body;
  const id = Number(req.params.id);
  /***** Never Trust Users! *****/

  if (isNaN(id)) {
    const err = new Error('Id must be a valid integer');
    err.status = 400;
    return next(err);
  }

  if (!req.body.title) {
    const err = new Error('Request must contain a title');
    err.status = 400;
    return next(err);
  }

  knex('stories')
    .update({
      title: title,
      content: content
    })
    .where('id', id)
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res, next) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    const err = new Error('Id must be a valid integer');
    err.status = 400;
    return next(err);
  }

  knex('stories')
    .where('id', id)
    .del()
    .then(result => { 
      if (result) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;