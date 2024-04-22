const joi = require('joi');
const {inputErr} = require('../../../helpers/customErrors')
const categoryUpdatingSchema = joi.object({
    name: joi.string().min(1),
  
});
const updateValidation = async (req, res, next) =>{
    try {
        const validated = await categoryUpdatingSchema.validateAsync(req.body);
        req.body = validated;
        next();
    } catch (error) {
        if(error.isJoi) 
            next(inputErr);
        next(error);
    }
   

}

module.exports = updateValidation;