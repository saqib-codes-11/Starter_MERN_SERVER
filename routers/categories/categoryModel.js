const mongoose = require('mongoose');
const categorySchema = require('./categorySchema');

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;