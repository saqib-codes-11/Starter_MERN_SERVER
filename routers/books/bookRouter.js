const util = require('util');
const express = require('express');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const signAsync = util.promisify(jwt.sign);
const verifyAsync = util.promisify(jwt.verify); 
const { customError, authError } = require('../../helpers/customErrors');
const BookModel = require('./bookModel');
const UsersModel = require("../users/usersModel")
const addValidation = require("./validation/bookAdd");
const updateValidation = require('./validation/bookUpdate');
const bookRouter = express.Router();
var cors = require('cors');
bookRouter.use(bodyParser.json({ limit: "50mb" }));
bookRouter.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
const { authorizeUser, authorizeAdmin, getUserId } = require('../../helpers/middlewares');
const getIdFromToken = require('../../helpers/getIdFromToken');

bookRouter.use(cors())
bookRouter.use((req, res, next) => {
    console.log(req.url);
    next();
});

bookRouter.post('/', authorizeAdmin, addValidation, async (req, res, next) => {

    const { name, AuthorId, CategoryId, image } = req.body;
    try {

        await BookModel.create({ name, AuthorId, CategoryId, image, noOfRatings: 0, rating: 0 });
        // console.log(name,AuthorId,CategoryId,image);
        // await BookModel.create({ name,AuthorId,CategoryId,image});
        res.send({ success: true });
    } catch (error) {
        next(error);
    }
});


bookRouter.get('/', async (req, res, next) => {
    const { page, name } = req.query;
    let pages = 0;
    const limit = 6;
    try {
        if (page) {
            BookModel.count().then((count) => { pages = Math.ceil(count / limit) }).then(() => {
                BookModel.aggregate([
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
                ], function (error, data) {
                    console.log(typeof data)
                    // data['pages'] = pages
                    console.log(data.pages)

                    return res.send({ data, pages });

                }).skip((limit * page) - limit).limit(limit)
            })
        } else if (name) {
            const books = await BookModel.aggregate([
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
                { $match: { name: new RegExp(name, "i") } }
            ]
            )
            res.send(books);
        } else {
            throw customError(404, "NOT_FOUND", "page not founf");
        }


    } catch (error) {
        next(error);
    }

});

bookRouter.patch('/:id', updateValidation, authorizeAdmin, async (req, res, next) => {

    const { id } = req.params;
    try {
        await BookModel.findByIdAndUpdate(id, { $set: req.body });
        res.send({ message: 'updated successfully' });
    } catch (error) {
        next(error);
    }
});


bookRouter.patch('/', async (req, res, next) => {
    const { oldStatus, oldRating } = req.query;
    // const { Uid } = req.params;
    let { isRated, Bid, status, review, rating } = req.body;
    isRated = isRated ? isRated : false;
    status = status ? status : 1;
    review = review ? review : undefined;
    rating = rating ? rating : 0;
    try {

        // const { token } = req.headers;
        // const secretKey = process.env.SECRET_KEY;
        // const { id } = await verifyAsync(token, secretKey);
        // console.log(id);
        const {token} = req.headers;
        const id = await getIdFromToken(token);
console.log(req);
        if (isRated && (rating || rating == 0)) {
            await BookModel.findByIdAndUpdate(Bid, { $inc: { noOfRatings: 1, rating: rating } });
            await UsersModel.updateOne(
                { '_id': id, "books": { $elemMatch: { _id: Bid } } },
                {
                    '$set': { 'books.$.rating': rating }
                })
            console.log("If 1");
        } else if (oldStatus == 0) {
            isRated = rating?true:false;
            await UsersModel.findByIdAndUpdate(id, { $push: { books: { _id: Bid, isRated, status, review, rating } } });
            console.log("If 2");
        } else {
            console.log("If 3");
            isRated = rating ? true : false;
            await UsersModel.updateOne(
                { '_id': id, "books._id": Bid },
                { '$set': { 'books.$.rating': rating, 'books.$.isRated': isRated, 'books.$.status': status, 'books.$.review': review } })
            await BookModel.findByIdAndUpdate(Bid, { $inc: { rating: rating - oldRating } });
        }

        // await UsersModel.findByIdAndUpdate(Uid, { $push: { books: { _id: Bid, isRated, status, review, rating } } });
        res.send({ message: "Book added Successfully" });
    } catch (error) {
        next(error)
    }

});

// bookRouter.patch('/rate/:Uid', async (req, res, next) => {
//     const { Uid } = req.params;
//     const { isRated, Bid, status, review,rating } = req.body;
//     isRated = isRated?isRated:false;
//     status = status?status:false;
//     review = review?review:false;
//     rating = rating?rating:false;
//     try {

//     } catch (error) {
//         next(error);
//     }
// });









// bookRouter.patch('/rate', async (req, res, next) => {
//     const { userRate, bookId, userId } = req.body;

//     try {

//         const isRate = await UsersModel.findOne(
//             { '_id': userId, "books._id": bookId },
//             { '$out': { 'books.$.isRated': 1 } }
//         )

//         // const isRate = await UsersModel.aggregate(
//         //     [
//         //         {$match: { '_id': userId, "books._id": bookId}},

//         //         // { $group: {
//         //         //         _id: 1,
//         //         //         isRated: [{$eq:['$isRated', true]}, 1, 0],
//         //         //     }
//         //         // },
//         //     ])
//         console.log(isRate);

//         // await UsersModel.findOneAndUpdate(
//         //     { '_id': userId, "books._id": bookId },
//         //     { '$set': { 'books.$.rating': userRate } })

//         // await BookModel.findByIdAndUpdate(bookId, { $inc: { noOfRatings: 1, rating: userRate } });

//         // { if: { $isArray: "$authors" }, then: { $size: "$authors" }, else: "NA" }

//         // await UsersModel.findOneAndUpdate(
//         //     { '_id': userId, "books._id": bookId },
//         //     { '$set': { 'books.$.isRated': true } })

//         res.send({ message: 'updated rating successfully' });
//     } catch (error) {
//         next(error);
//     }
// })

bookRouter.patch('/shelve', async (req, res, next) => {
    const { bookShelve, bookId, userId } = req.body;

    try {
        await UsersModel.findOneAndUpdate(
            { '_id': userId, "books._id": bookId },
            { '$set': { 'books.$.status': bookShelve } })

        res.send({ message: 'updated book shelve successfully' });
    } catch (error) {
        next(error);
    }
})

bookRouter.get("/popular", async (req, res, next) => {
    try {
        const popularBooks = await (await BookModel.find({}).sort({ rating: 1 })).splice(-3).reverse();
        res.status(200).send(popularBooks);
    } catch (error) {
        next(error);
    }
})


bookRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const books = await BookModel.findById(id);
        res.send(books);
    } catch (error) {
        next(error);
    }

});


bookRouter.delete("/:id", authorizeAdmin, async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    try {
        await BookModel.findByIdAndDelete(id);
        res.send({ message: "successfully deleted" });

    } catch (error) {
        next(error);
    }
});




module.exports = bookRouter;