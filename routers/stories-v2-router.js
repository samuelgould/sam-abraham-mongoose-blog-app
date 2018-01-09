'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const { Post } = require('../models');

router.get('/posts', (req, res) => {
  console.log('I am trying to retrieve some posts');
  Post
    .find()
    .limit(10)
    .then(posts => {
      res.json({ 
        posts: posts.map(
          (post) => post.serialize()
        )
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/posts/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(result => {
      console.log(`Here is the ID given to me: ${req.params.id}`);
      res.json(result.serialize()); 
    })
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

router.post('/posts', (req, res) => {
  const requiredFields = ['title','content','author'];

  for(let i=0; i < requiredFields.length;  i++){
    let field = requiredFields[i];
    if(!(field in req.body)){
      const message = `required field ${field} is missing in body`;
      res.sendStatus(400).send(message);
    }
  }
    
  const {title, content, author} = req.body;
  console.log('About to create a record');
  Post.create({
    title: title, 
    content: content, 
    author: author
  })
    .then(result => {
      console.log('HEY from Then');
      res.json(result.serialize());
    })
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

router.put('/posts/:id', (req, res) => {

  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  
  const updateToPost = {};
  const updateableFields = ['title', 'content', 'author'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updateToPost[field] = req.body[field];
    }
  });

  Post
    .findandUpdateById(req.params.id, { $set: updateToPost })
    .then(result => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

router.delete('/posts/:id', (req, res) => {
  Post
    .findByIdAndRemove(req.params.id)
    .then(result => res.status(201).end())
    .catch(err => res.status(500).json({ message: 'Internal server error'}));
});

/* ========== GET/READ ALL AUTHORS ========== */

// router.get('/authors', (req, res, next) => {
//   knex.select('id', 'username', 'email')
//     .from('authors')
//     .then(result => {
//       if (result) {
//         res.json(result);
//       } else {
//         next();
//       }
//     })
//     .catch(next);
// });

// /* ========== GET/READ ALL ITEMS ========== */
// router.get('/stories', (req, res, next) => {
//   if (req.query.search) {
//     knex.select('id', 'author_id', 'title', 'content')
//       .from('stories')
//       .then(result => res.json(result.filter((obj) => obj.title.includes(req.query.search))));
//   } else {
//     knex('stories')
//       .join('authors', 'authors.id', '=', 'stories.author_id')
//       .select('stories.id', 'stories.title', 'stories.content', 'authors.username as authorName', 'authors.id as authorId')
//       .then(result => {
//         if (result) {
//           res.json(result);
//         } else {
//           next();
//         }
//       })
//       .catch(next);
//   }
// });

// /* ========== GET/READ SINGLE ITEMS ========== */
// router.get('/stories/:id', (req, res, next) => {
//   const id = Number(req.params.id);

//   if (isNaN(id)) {
//     const err = new Error('Id must be a valid integer');
//     err.status = 400;
//     return next(err);
//   }

//   knex('stories')
//     .join('authors', 'authors.id', '=', 'stories.author_id')
//     .select('stories.id', 'stories.title', 'stories.content', 'authors.username as authorName', 'authors.id as authorId')
//     .where('stories.id', id)
//     .then(([result]) => {
//       if (result) {
//         res.json(result);
//       } else {
//         next();
//       }
//     })
//     .catch(next);
// });

// /* ========== POST/CREATE ITEM ========== */
// router.post('/stories', (req, res, next) => {
//   const { title, content, author_id } = req.body;

//   if (!req.body.title) {
//     const err = new Error('Request must contain a title');
//     err.status = 400;
//     return next(err);
//   }

//   const newItem = {
//     title: title,
//     content: content,
//     author_id: author_id
//   };

//   knex('stories')
//     .insert(newItem)
//     .returning(['id', 'title', 'content', 'author_id'])
//     .then(([result]) => {
//       if (result) {
//         return knex('stories')
//           .join('authors', 'authors.id', '=', 'stories.author_id')
//           .where('stories.id', result.id)
//           .select('stories.id', 'stories.title', 'stories.content', 'authors.username as authorName', 'authors.id as authorId');
//       } else {
//         next();
//       }
//     })
//     .then(([modifiedResult]) => {
//       if (modifiedResult) {
//         res.location(`${req.originalUrl}/${modifiedResult.id}`).status(201).json(modifiedResult);
//       } else {
//         next();
//       }
//     })
//     .catch(next);
// });

// /* ========== PUT/UPDATE A SINGLE ITEM ========== */
// router.put('/stories/:id', (req, res, next) => {
//   const { title, content, author_id } = req.body;
//   const id = Number(req.params.id);
//   /***** Never Trust Users! *****/

//   if (isNaN(id)) {
//     const err = new Error('Id must be a valid integer');
//     err.status = 400;
//     return next(err);
//   }

//   if (!req.body.title) {
//     const err = new Error('Request must contain a title');
//     err.status = 400;
//     return next(err);
//   }

//   knex('stories')
//     .update({
//       title: title,
//       content: content,
//       author_id: author_id
//     })
//     .where('id', id)
//     .returning(['id', 'title', 'content', 'author_id'])
//     .then(([result]) => {
//       if (result) {
//         return knex('stories')
//           .join('authors', 'authors.id', '=', 'stories.author_id')
//           .where('stories.id', result.id)
//           .select(['stories.id', 'stories.title', 'stories.content', 'authors.username as authorName', 'authors.id as authorId']);
//       } else {
//         next();
//       }
//     })
//     .then(([modifiedResult]) => {
//       if (modifiedResult) {
//         res.json(modifiedResult);
//       } else {
//         next();
//       }
//     })
//     .catch(next);
// });

// /* ========== DELETE/REMOVE A SINGLE ITEM ========== */
// router.delete('/stories/:id', (req, res, next) => {
//   const id = Number(req.params.id);

//   if (isNaN(id)) {
//     const err = new Error('Id must be a valid integer');
//     err.status = 400;
//     return next(err);
//   }

//   knex('stories')
//     .where('id', id)
//     .del()
//     .then(result => {
//       if (result) {
//         res.status(204).end();
//       } else {
//         next();
//       }
//     })
//     .catch(next);
// });

module.exports = router;