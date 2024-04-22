const joi = require('joi');
const {inputErr} = require('../../../helpers/customErrors')
const authorUpdatingSchema = joi.object({
    name: joi.string().min(1),
    CategoryId: joi.string().meta({
      _mongoose: { type: "ObjectId", ref: "category" },
    }),
    AuthorId: joi.string().meta({
      _mongoose: { type: "ObjectId", ref: "author" },
    }),
    image: joi.string().allow('').optional(),
    
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