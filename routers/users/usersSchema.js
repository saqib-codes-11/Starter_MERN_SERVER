const { string } = require("joi");
const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema({
  firstName: { type: "string", required: true },
  lastName: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
  date_of_birth: { type: "date", required: true },
  gender: { type: "string", required: true },
  country: { type: "string", required: true },
  image: { type: "string" },
  books: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      status: { type: "number", required: true },
      rating: { type: "number" },
      review: { type: "string" },
      isRated: { type: "boolean" },
    },
  ],
});

module.exports = usersSchema;
