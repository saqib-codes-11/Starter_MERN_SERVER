const joi = require("joi");
const { inputErr } = require("../../../helpers/customErrors");
const categoryAddingSchema = joi.object({
  name: joi.string().min(1).required(),
   
});
const addValidation = async (req, res, next) => {
  try {
    const validated = await categoryAddingSchema.validateAsync(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error.isJoi) next(inputErr);
    next(error);
  }
};

module.exports = addValidation;
