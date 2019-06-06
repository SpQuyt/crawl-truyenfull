const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
var Schema = mongoose.Schema;

var chapterSchema = new Schema({
  "header": { type : String , unique : true, dropDups: true },
  "fromStory": { type : String, ref : 'Story'},
  "body": Array,
})

module.exports = chapterSchema