const util = require('util');
const jwt = require('jsonwebtoken');
const { authorizationError } = require('./customErrors');
const verifyAsync = util.promisify(jwt.verify);   //function used to verify token

exports.authorizeUser = async ( req, res, next ) => {
    const { token } = req.headers;
    const secretKey = process.env.SECRET_KEY;
    try {
        await verifyAsync(token, secretKey);
    } catch (error) {
        next(authorizationError);
    }
    next();
};

exports.authorizeAdmin = async ( req, res, next ) => {
    const { token } = req.headers;
    const secretKey = process.env.SECRET_KEY;
    try {
        const payload = await verifyAsync(token, secretKey);
        if(!payload.admin) throw authorizationError;
    } catch (error) {
        next(authorizationError);
    }
    next();
};