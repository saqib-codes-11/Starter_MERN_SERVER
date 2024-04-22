const joi = require('joi');
const {inputErr} = require('../../../helpers/customErrors')
const userAddingSchema = joi.object({
    firstName:joi.string().min(1).required(),
    lastName: joi.string().min(1).required(),
    password: joi.string().regex(new RegExp('^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"<>,.?/_₹]).{8,16}$')).required(),
    date_of_birth: joi.date().raw().required(),
    gender : joi.string().min(1).valid("male","female").required(),
    country :joi.string().min(1).required(),
    email : joi.string().email().required(),
    image: joi.string(),
    books : joi.object()
});

const addValidation = async (req, res, next) =>{
    try {
        const validated = await userAddingSchema.validateAsync(req.body);
        req.body = validated;
        next();
    } catch (error) {
        if(error.isJoi) 
            next(inputErr);
        next(error);
    }
}

module.exports = addValidation;