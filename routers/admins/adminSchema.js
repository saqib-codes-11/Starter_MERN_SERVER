const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    username: 'string',
    password: 'string'
});

module.exports = adminSchema;
