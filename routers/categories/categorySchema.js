const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    name: 'string'
});

module.exports = categorySchema;
