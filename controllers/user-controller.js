const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error')
const User = require('../models/users')
const cloudinary = require('../middleware/cloudinary')

const getUsers = async (req, res, next) => {
    let foundUsers;
    try {
        foundUsers = await User.find({}, '-password')
    } catch (e) {
        return next(new Error('Something went wrong!', 500))
    }
    res.status(200).json({ users: foundUsers })
}

const getUserById = async (req, res, next) => {
    const { uid } = req.params;
    let foundUser;
    try {
        foundUser = await User.findById(uid);
    } catch (err) {
        return next(new HttpError('Something went wrong.Try again.', 500))
    }
    //triggering error handling middleware using Error Model-HttpError()
    if (!foundUser) {
        return next(new HttpError('Could not find the user with this id.', 404))
    }
    res.json(foundUser)
}

const getUserByIdAndUpdate = async (req, res, next) => {
    const { uid } = req.params
    let foundUser, result, ImgResult;
    try {
        foundUser = await User.findById(uid)
    } catch (err) {
        return next(new HttpError('Something went wrong.Try again.', 500))
    }
    if (!foundUser) {
        return next(new HttpError('Could not find the user.', 404))
    } else {
        if (req.body.url) {
            try {
                console.log(req.body.url)
                ImgResult = await cloudinary.uploader.upload(req.body.url, { folder: 'memories' })
                result = await User.updateOne({ _id: foundUser._id },
                    {
                        url: {
                            public_id: ImgResult.public_id,
                            url: ImgResult.secure_url
                        }
                    }
                )
            } catch (err) {
                return next(new HttpError(err, 500))
            }
        } else {
            try {
                result = await User.updateOne({ _id: foundUser._id }, req.body)
            } catch (err) {
                return next(new HttpError(err, 500))
            }
        }
    }
    res.json(foundUser)
}


const signupUser = async (req, res, next) => {
    const Result = validationResult(req)
    if (!Result.isEmpty()) {
        return next(new HttpError(Result.errors[0].msg, 422))
    }
    const { name, email, bio, password } = req.body
    let foundUser;
    try {
        foundUser = await User.findOne({ email: email })
        console.log(foundUser)
    } catch (err) {
        return next(new HttpError("Something went wrong", 500))
    }
    if (foundUser) {
        return next(new HttpError("Could not signup,email already exist!", 422))//422-invalid user i/p
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    }catch(err){
        return next(new HttpError("Something went wrong", 500))
    }

    const newUser = new User({
        name, email, posts: [], bio, password:hashedPassword, url: {
            public_id: '',
            url: ''
        }
    })
    try {
        await newUser.save()
    } catch (err) {
        return next(new HttpError('Something went wrong.Try again.', 500))
    }

    let token;
    try{
        token=jwt.sign({userId: newUser._id,email: newUser.email},process.env.SECRET_KEY,{expiresIn:'1h'})
    }catch(err){
        return next(new HttpError('Something went wrong.Try again.',500))
    }

    res.status(200).json({userId: newUser._id,email: newUser.email,token:token})
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body
    let userFound;
    try {
        userFound = await User.findOne({ email: email })
    } catch (e) {
        return next(new HttpError("Something went wrong", 500))
    }
    if (!userFound) {
        return next(new HttpError('Could not login user,credentials seems to be wrong!', 401))//401-authentication failed
    }

    let isValidPassword =false;
    try{
        isValidPassword = await bcrypt.compare(password,userFound.password)
    }catch(err){
        return next(new HttpError('Could not login user,credentials seems to be wrong!', 500))
    }

    if(!isValidPassword){
        return next(new HttpError('Could not login user,credentials seems to be wrong!',401))
    }

    let token;
    try{
        token=jwt.sign({userId:userFound.id,email:userFound.email},process.env.SECRET_KEY,{expiresIn:'1h'})
    }catch(err){
        return next(new HttpError('Something went wrong.Try again.',500))
    }

    res.json({userId:userFound.id,email:userFound.email,token:token })
}


exports.getUsers = getUsers
exports.getUserById = getUserById
exports.getUserByIdAndUpdate = getUserByIdAndUpdate
exports.loginUser = loginUser
exports.signupUser = signupUser