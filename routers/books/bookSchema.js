const { number } = require('joi');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    rating: 'number',
    noOfRatings: 'number',
    image:'string',
    name: 'string',
    // rating: 'number',
    CategoryId:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    AuthorId:[{ type: mongoose.Schema.Types.ObjectId,ref:'Author' }]
});

module.exports = bookSchema;
