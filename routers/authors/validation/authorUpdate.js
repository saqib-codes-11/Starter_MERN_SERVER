const joi = require('joi');
const {inputErr} = require('../../../helpers/customErrors')
const authorUpdatingSchema = joi.object({
    firstName:joi.string().min(1),
    lastName: joi.string().min(1),
    dateOfBirth: joi.date(),
   image: joi.string()
});
const updateValidation = async (req, res, next) =>{
    try {
        const validated = await authorUpdatingSchema.validateAsync(req.body);
        req.body = validated;
        next();
    } catch (error) {
        if(error.isJoi) 
            next(inputErr);
        next(error);
    }
   

}

module.exports = updateValidation;