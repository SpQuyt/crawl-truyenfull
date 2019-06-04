const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  "name": String,
  "description": String,
})

module.exports = categorySchema