const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
var Schema = mongoose.Schema;

var storySchema = new Schema({
  "title": String,
  "author": String,
  "description": String,
  "poster": String,
  "category": Array,
  "status": String,
})

module.exports = storySchema