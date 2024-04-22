const mongoose = require('mongoose');
const adminSchema = require('./adminSchema');

const AdminModel = mongoose.model('Admin', adminSchema);

module.exports = AdminModel;