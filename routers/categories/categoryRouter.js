// const util = require('util');
const express = require('express');
// const jwt = require('jsonwebtoken');
// const signAsync = util.promisify(jwt.sign);
const {customError, authError} = require('../../helpers/customErrors');
const CategoryModel = require('./categoryModel');
const { authorizeUser, authorizeAdmin } = require('../../helpers/middlewares');
const categoryRouter = express.Router();
const addValidation = require("./validation/categoryAdd");
const updateValidation = require('./validation/categoryUpdate');
var cors = require('cors');
const BookModel = require('../books/bookModel');
const getIdFromToken  = require('../../helpers/getIdFromToken');
const mongoose = require('mongoose');

categoryRouter.use(cors())
categoryRouter.use((req,res, next)=> {
    console.log(req.url);
    next();
});


categoryRouter.post('/',addValidation,authorizeAdmin, async (req, res, next) => {
    const { name} = req.body;
    try {
        await CategoryModel.create({ name});
        res.send({success: true});
    } catch (error) {
        next(error);
    }
});


categoryRouter.get('/', async (req, res, next) => {
    const { name,  categoryId} = req.query;
    try {
        if(name){
            const category = await CategoryModel.find({ name: new RegExp(name, "i") })
            res.send(category);
        } 
        else if(categoryId){
            console.log("else if")
                let idToSearch = mongoose.Types.ObjectId(categoryId)
                const books = await BookModel.aggregate([
                {$match: {"CategoryId.0": idToSearch}},
                {
                    $lookup: {
                        from: "authors",
                        localField: "AuthorId",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "CategoryId",
                        foreignField: "_id",
                        as: "category"
                    }
                },
            ])

            res.send(books)
        }  
        else{
            console.log("else")
            const categories = await CategoryModel.find({});
            res.send(categories);
        }
    }
    catch (error) {
        next(error);
    }
});


categoryRouter.get("/popular", async (req, res, next) => {
    let authorArray = [];
    try {
        let popularCategories = await BookModel.aggregate([
            { $group : { _id : "$CategoryId", categories: { $push: "$name" } } },
            { $project: {
                _id: 1,
                numberOfCategories: { $cond: { if: { $isArray: "$categories" }, then: { $size: "$categories" }, else: "NA"} }
             } },
            { $sort  : { numberOfCategories: 1 }}

        ])

        popularCategories = popularCategories.slice(-3).reverse();

        for(let i=0 ; i<3; i++){
            const myId = (popularCategories[i]._id[0]);
            authorArray.push(await CategoryModel.findById(myId));
            if(i == 2){
                res.send(authorArray);
            }
        }

    } catch (error) {
        next(error);
    }
})

categoryRouter.get('/:categoryId', async (req, res, next)=> {
    const { categoryId } = req.params;
    try {
        const books = await BookModel.find({"CategoryId.0": categoryId});
        res.send(books);
    } catch (error) {
        next(error);
    }
});


categoryRouter.patch('/:id',updateValidation, authorizeAdmin,async (req, res,next)=> {

    const { id } = req.params;
    try {
        await CategoryModel.findByIdAndUpdate(id, {$set: req.body});
        res.send({message: 'updated successfully'}); 
    } catch (error) {
        next(error);
    }
});


categoryRouter.delete("/:id",authorizeAdmin, async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    try {
      await CategoryModel.findByIdAndDelete(id);
      res.send({ message: "successfully deleted" });
  
    } catch (error) {
      next(error);
    }
  });
  
module.exports = categoryRouter;