const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error')
const User = require('../models/users')

const getUsers = async (req, res, next) => {
    let foundUsers;
    try {
        foundUsers = await User.find({}, '-password')
    } catch (e) {
        return next(new Error('Something went wrong!', 500))
    }
    res.status(200).json({users:foundUsers})
}

const signupUser = async (req, res, next) => {
    const Result = validationResult(req)
    console.log(Result)
    if (!Result.isEmpty()) {
        return next(new HttpError(Result.errors[0].msg, 422))
    }
    const { name, email,bio, password } = req.body
    let foundUser;
    try {
        foundUser = await User.findOne({ email: email })
    } catch (err) {
        return next(new HttpError("Something went wrong", 500))
    }
    if (foundUser) {
        return next(new HttpError("Could not signup,email already exist!", 422))//422-invalid user i/p
    }
    const newUser = new User({ name, email, posts: [],bio,password })
    try {
        await newUser.save()
    } catch (err) {
        return next(new HttpError("Could not signup,Please try again later!", 500))
    }

    res.status(200).json(newUser)
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body
    let userFound;
    try {
        userFound = await User.findOne({ email: email })
    } catch (e) {
        return next(new HttpError("Something went wrong", 500))
    }
    if (!userFound || userFound.password !== password) {
        return next(new HttpError('Could not identify user,credentials seems to be wrong!', 401))//401-authentication failed
    }
    res.json({ message: "logged in successfully" })
}


exports.getUsers = getUsers
exports.loginUser = loginUser
exports.signupUser = signupUser