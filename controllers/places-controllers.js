const { validationResult } = require('express-validator');
const mongoose = require('mongoose')

const HttpError = require('../models/http-error')
const Place = require('../models/places')
const User = require('../models/users')


const getAllPlaces = async(req,res,next) =>{
    let foundPlaces;
    try {
        foundPlaces = await Place.find({})
    }catch(e){
        return next(new HttpError("Something went wrong",500))
    }
    res.status(200).json({places: foundPlaces})
}

const getPlaceById = async (req, res, next) => {
    const { pid } = req.params;
    let foundPlace;
    try {
        foundPlace = await Place.findById(pid);
    } catch (err) {
        return next(new HttpError("Something went wrong,Could not find place", 500))
    }
    //triggering error handling middleware using Error Model-HttpError()
    if (!foundPlace) {
        return next(new HttpError('Could not find the place with provided pid.', 404))//404-not found
    }
    res.json({ place: foundPlace })
}

const getPlaceByUserId = async (req, res, next) => {
    const { uid } = req.params;
    let foundPlaces;
    try {
        foundPlaces = await Place.find({creatorID:uid});
    } catch (err) {
        return next(new HttpError("Something went wrong,Could not find place", 500))
    }
    //triggering error handling middleware using Error Model-HttpError()
    if (!foundPlaces) {
        return next(new HttpError('Could not find the places with provided user id.', 404))//404-not found
    }
    res.json({ places: foundPlaces })
    
}


const createPlace = async (req, res, next) => {
    const Result = validationResult(req)
    if (!Result.isEmpty()) {
        return next(new HttpError(Result.errors[0].msg, 422))
    }
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const { name, description, address, url, creatorID } = req.body
    const createdPlace = new Place({
        name,
        description,
        address,
        url,
        creatorID,//creatorID add by us while creating new place
        postDate: `${day}-${month}-${year}`
    })

    let user;
    try {
        user = await User.findById(creatorID)
    } catch (e) {
        return next(new HttpError("Something went wrong", 500))
    }

    if (!user) {
        return next(new HttpError("Couldn't found user with provided id", 404))
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdPlace.save({ session: sess })
        user.posts.push(createdPlace)
        await user.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        return next(new HttpError("Failed to create place, try again.", 422))
    }
    res.status(201).json(createdPlace)
}

const updatePlace = async (req, res, next) => {
    const Result = validationResult(req)
    if (!Result.isEmpty()) {
        return next(new HttpError(Result.errors[0].msg, 422))
    }
    const { pid } = req.params;
    const { name, description, address, url } = req.body
    let result;
    try {
        result = await Place.findOneAndUpdate({ _id: pid }, { name, description, address, url })
    } catch (err) {
        return next(new HttpError("Something went wrong", 500))
    }
    res.status(200).json(result)
}

const deletePlace = async (req, res, next) => {
    const { pid } = req.params
    let foundPlace
    try {
        foundPlace = await Place.findById(pid).populate('creatorID')
    } catch (err) {
        return next(new HttpError("Something went wrong", 500))
    }
    if (!foundPlace) {
        return next(new HttpError("Could not find place the place with id provided", 404))
    }
    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await foundPlace.remove({ session: sess })
        foundPlace.creatorID.posts.pull(foundPlace)
        await foundPlace.creatorID.save({ session: sess })
        await sess.commitTransaction()
    } catch (err) {
        return next(new HttpError("Failed to delete place", 500))
    }
    res.status(200).json({ message: "places Deleted" })
}

exports.getAllPlaces = getAllPlaces
exports.getPlaceById = getPlaceById
exports.getPlaceByUserId = getPlaceByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace