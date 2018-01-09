'use strict';

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  'title': { type: String, required: true },
  'content': { type: String, required: true },
  'author': {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  },
  'created': Date
});

postSchema
  .virtual('fullName')
  .get(function () {
    return this.author.firstName + ' ' + this.author.lastName;
  })
  .set(function (fullName) {
    const [first, last] = fullName.split(' ');
    this.firstName = first;
    this.lastName = last;
  });

postSchema.methods.addDate = function() {
  this.created = this._id.getTimestamp();
  return this.created;
  // create a method which will automatically apply a datetime timestamp when a post is created
};

postSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.fullName,
    created: this.addDate()
  };

};

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };