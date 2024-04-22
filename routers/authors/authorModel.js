const mongoose = require('mongoose');
const authorSchema = require('./authorSchema');

const AuthorModel = mongoose.model('Author', authorSchema);

module.exports = AuthorModel;