const jwt = require("jsonwebtoken");
const { nextTick } = require("process");
const util = require("util"); // a library to promisify jwt functions (sign,verify)
const verifyAsync = util.promisify(jwt.verify); //function used to verify token

const getIdFromToken = async (token) =>{

    const secretKey = process.env.SECRET_KEY;
    const {id} = await verifyAsync(token, secretKey);
    return id;
}

module.exports = getIdFromToken;


/*
 //// use these at your requests
    const {token} = req.headers;
    const id = await getIdFromToken(token);
*/
