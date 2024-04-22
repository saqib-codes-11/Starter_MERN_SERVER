const express = require("express");
const { dirname } = require("path"); //to facilitate file paths
const bcrypt = require("bcrypt"); // for encryption
const jwt = require("jsonwebtoken");
const util = require("util"); // a library to promisify jwt functions (sign,verify)
const signAsync = util.promisify(jwt.sign); // used in sign and create token
const usersModel = require("./usersModel");
const { authError } = require("../../helpers/customErrors");
const addValidation = require("./validation/userAdd");
const { authorizeUser } = require("../../helpers/middlewares");
const updateValidation = require("./validation/userUpdate");
const categoriesRouter = require("../categories/categoryRouter");
const authorsRouter = require("../authors/authorRouter");
const booksRouter = require("../books/bookRouter");
const { send } = require("process");
const BookModel = require("../books/bookModel");
const getIdFromToken = require("../../helpers/getIdFromToken");

// creation of Router
const usersRouter = express.Router();
usersRouter.use(["/category", "/categories"], categoriesRouter);
usersRouter.use(["/author", "/authors"], authorsRouter);
usersRouter.use(["/book", "/books"], booksRouter);


//........................adding...........//
usersRouter.post("/signup", addValidation, async (req, res, next) => {
  const saltRounds = 12; 
  const {
    firstName,
    lastName,
    email,
    password,
    date_of_birth,
    gender,
    country,
  } = req.body;

  if (await usersModel.findOne({ email }))
    return res.send({ failed: "Email already exists !" });
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await usersModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      date_of_birth,
      gender,
      country,
    });
    res.send({ success: true });
  } catch (error) {
    next(error); // that error is handeled by app.use(err,req,res,next) in the serve page
  }
});


//..................................login..............................//
usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const secretKey = process.env.SECRET_KEY; 
  try {
    const user = await usersModel.findOne({ email }); 
    if (!user) throw authError;
    const result = await bcrypt.compare(password, user.password); //return true or false
    if (!result) throw authError;
    const token = await signAsync(
      {
        id: user.id,
        admin: false,
      },
      secretKey
    ); 
    res.send({ token, id: user.id });
  } catch (error) {
    next(error);
  }
});


// //....................................Updating.............................//
usersRouter.patch("/", updateValidation, authorizeUser, async (req, res, next) => {
    const { password } = req.body;
    const {token} = req.headers;
    const saltRound = 12;
    try {
      const id = await getIdFromToken(token);
      const hashedPassword = password
        ? await bcrypt.hash(password, saltRound)
        : undefined;
      req.body.password = hashedPassword;
      await usersModel.findByIdAndUpdate(id, { $set: req.body });
      res.send({ message: "Updatted Successfully" });
    } catch (error) {
      next(error);
    }
  }
);


usersRouter.get('/wishlist', async (req, res, next) => {
  const {token} = req.headers;
  let books = [];
  try {
    const id = await getIdFromToken(token);
    const bId = (await usersModel.findById(id)).books;
    for(let i = 0; i < bId.length; i++){
      books.push({book:(await BookModel.findById(bId[i]._id)), bookRate:bId[i]})
    }

    res.send(books);
  } catch (error) {
    next(error);
  }
});


// usersRouter.put('/:Uid', async (req, res, next) => {
//   const { Uid } = req.params;
//   const { isRated, Bid, status, review,rating } = req.body;
//     isRated = isRated?isRated:false;
//     status = status?status:false;
//     review = review?review:false;
//     rating = rating?rating:false;
//   try {
//     // const { token } = req.headers;
//     // const secretKey = process.env.SECRET_KEY;
//     // const { id } = await verifyAsync(token, secretKey);
//     // console.log(id);
//     await usersModel.findByIdAndUpdate(Uid, { $push: { books: { _id: Bid, isRated, status, review, rating } } });
//     res.send({ message: "Book added Successfully" });
//   } catch (error) {
//     next(error)
//   }

// });

// usersModel.get('/wishlist', async)


usersRouter.get("/rate/:Bid", async (req, res, next) => {
  const { Bid } = req.params;
  const { token } = req.headers;
  try {
    const id = await getIdFromToken(token);
    // { isRated, status, rating, review }
    // const book = (
    //   await usersModel.find(
    //     { "books._id": Bid },
    //     { _id: id, books: { $elemMatch: { _id: Bid } } }
    //   )
    // )[0].books[0];
    // const id = "62865302adfa78c9068bef84"
    const book = (
      await usersModel.find(
        { _id: id },
        { books: { $elemMatch: { _id: Bid } } }
      )
    )[0].books[0];

    console.log(book);
    res.send(book);
  } catch (error) {
    next(error);
  }
});
///////////////////////////////////
usersRouter.get("/reviews/:Bid", async (req, res, next) => {
  const { Bid } = req.params;
  
  try {
  
    const book = (
      await usersModel.find(
        { books: { $elemMatch: { _id: Bid,isRated:true } },
        
      
      
      }
      ).select("firstName lastName books.$ image")
    );

    console.log(book);
    res.send(book);
  } catch (error) {
    next(error);
  }
});

//.............................//
usersRouter.get("/", async (req, res, next) => {
  const { token } = req.headers;
  try {
    const id = await getIdFromToken(token);
    const user = await usersModel.findById(id);
    // { isRated, status, rating, review }
    //   if (Uid == id){
    //   const user = (await usersModel.findById(Uid));
    // }
    // else{
    //   next(customError);
    // }
    console.log(user);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
