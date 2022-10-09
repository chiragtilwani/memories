const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error')
const Place = require('../models/places')

let dummyPlace = [
    {
        id: 'p1', name: 'Mysore Palace', postedBy: 'chirag', description: 'Indo-Saracenic palace, completed in 1912, with a grand durbar hall and weekly illuminations.', address: 'Sayyaji Rao Rd, Agrahara, Chamrajpura, Mysuru, Karnataka 570001', url: "https://lh5.googleusercontent.com/p/AF1QipOxM9k1RkWMiEPLGKjZFhMXu6YSkenS0KtlyZLn=w408-h306-k-no", liked: false, n_likes: 0, location: {
            lng: 12.3051682,
            lat: 76.6529862
        }, creatorID: 'u1', postDate: 'sun jul 03 2022'
    }
]

const getPlaceById = async (req, res, next) => {
    const { pid } = req.params;
    let foundPlace;
    try {
        foundPlace = await Place.findById(pid);
    }catch(err){
        return next(new HttpError("Something went wrong,Could not find place",500))
    }
    //triggering error handling middleware using Error Model-HttpError()
    if (!foundPlace) {
        return next(new HttpError('Could not find the place with provided pid.', 404))//404-not found
    }
    res.json({place:foundPlace})
}

const getPlacesByUserId = async (req, res, next) => {
    const { uid } = req.params;
    let foundPlaces;
    try{
     foundPlaces = await Place.find({creatorID:uid});
    }catch (err) {
        return next(new HttpError('Something went wrong.Try again.', 500))
    }
    //triggering error handling middleware using Error Model-HttpError()
    if (!foundPlaces || foundPlaces.length === 0) {
        return next(new HttpError('Could not find the places with provided pid.', 404))
    }
    res.json(foundPlaces)
}

const createPlace = async (req, res, next) => {
    const Result = validationResult(req)
    if (!Result.isEmpty()) {
        return next(new HttpError(Result.errors.map(err => err.msg), 422))
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
    try {
        await createdPlace.save()
    }
    catch (err) {
        return next(new HttpError("Failed to create place, try again.", 422))
    }
    res.status(201).json(createdPlace)
}

const updatePlace = async(req, res, next) => {
    const Result = validationResult(req)
    if (!Result.isEmpty()) {
        return next(new HttpError(Result.errors.map(err => err.msg), 422))
    }
    const { pid } = req.params;
    const { name, description, address, url } = req.body
    let result;
    try{
     result=   await Place.findOneAndUpdate({_id:pid},{ name, description, address, url})
    }catch(err){
        return next(new HttpError("Something went wrong",500))
    }
    res.status(200).json(result)
}

const deletePlace = async(req, res, next) => {
    const { pid } = req.params
    let foundPlace
    try{
        foundPlace =await Place.findByIdAndDelete(pid)
    }catch(err){
        return next(new HttpError("Something went wrong",500))
    }
    if (!foundPlace) {
        return next(new HttpError("Could not find place the place with id provided", 404))
    }
    res.status(200).json({ message: "places Deleted" })
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace