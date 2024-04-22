const joi = require("joi");
const { inputErr } = require("../../../helpers/customErrors");
const bookAddingSchema = joi.object({
  firstName: joi.string().min(1).required(),
  lastName: joi.string().min(1).required(),
  dateOfBirth: joi.date(),
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
