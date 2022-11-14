const jwt = require('jsonwebtoken')

const HttpError = require("../models/http-error");

function AuthMiddleware(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1];//authorization:'someString TOKEN'
        if (!token) {
            throw new Error('Authentication failed', 401);
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        req.userData = { userId: decodedToken.userId }
        next()
    } catch (err) {
        return next(new HttpError("Authentication failed", 401));
    }
}

module.exports = AuthMiddleware