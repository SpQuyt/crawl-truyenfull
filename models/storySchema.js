const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
var Schema = mongoose.Schema;

var storySchema = new Schema({
  "title": { type : String , unique : true, dropDups: true },
  "author": String,
  "description": Array,
  "poster": String,
  "categoryList": Array,
  "status": String,
})

module.exports = storySchema