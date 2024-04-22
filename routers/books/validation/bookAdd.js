const joi = require("joi");
const { inputErr } = require("../../../helpers/customErrors");
const bookAddingSchema = joi.object({
  name: joi.string().min(1).required(),
  CategoryId: joi.string().meta({
    _mongoose: { type: "ObjectId", ref: "category" },
  }).required(),
  AuthorId: joi.string().meta({
    _mongoose: { type: "ObjectId", ref: "author" },
  }).required(),
  image: joi.string().allow('').optional(),
  
});
const addValidation = async (req, res, next) => {
  try {
    const validated = await bookAddingSchema.validateAsync(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error.isJoi) next(inputErr);
    next(error);
  }
};

module.exports = addValidation;
