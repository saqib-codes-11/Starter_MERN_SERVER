const mongoose = require('mongoose');
const bookSchema = require('./bookSchema');

const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;
