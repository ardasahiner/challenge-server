const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.ObjectId;

const keySchema = new mongoose.Schema({
  key: String,
  user: ObjectId
});

module.exports = mongoose.model('Key', keySchema);
