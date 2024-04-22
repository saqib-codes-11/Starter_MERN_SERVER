const mongoose = require('mongoose');
const usersSchema = require('./usersSchema')
const usersModel = mongoose.model('Users',usersSchema);  //carsModel is a model in the app (something like collection).. name of the collection is (cars) and following the schema passed
module.exports = usersModel;  