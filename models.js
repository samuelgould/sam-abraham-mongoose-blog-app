'use strict';

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  'title': {type: String, required: true},
  'content': {type: String, required: true},
  'author': { 
    firstName: { type: String, required: true },
    lastName: {type: String, required: true}
  }, 
  'created':  Date
});

postSchema
.virtual(fulName)
.get(function(){
  return this.author.firstName + ' ' + this.author.lastName;
})
.set(function(fullName){
  const [first, last] = fullName.split(' ');
  this.firstName = first;
  this.lastName = last;
});

postSchema.methods.addDate(post => {
  // create a method which will automatically apply a datetime timestamp when a post is created
})

postSchema.methods.serialize((post)=>{
  return {
    title: this.post.title,
    content: this.post.content,
    author: this.post.fullName,
    created: this.post.addDate()
  };

})

const Post = mongoose.model('Post', postSchema);

module.exports = {Post};