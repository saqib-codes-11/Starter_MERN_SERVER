const mongoose = require('mongoose');
const authorSchema = new mongoose.Schema({
    
    image: 'string',
    firstName: 'string',
    lastName: 'string',
    dateOfBirth: 'date',


});

module.exports = authorSchema;
