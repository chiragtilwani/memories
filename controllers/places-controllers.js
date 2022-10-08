const { v4: uuidv4 } = require('uuid');
const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error')

let dummyPlace = [
    {
        id: 'p1', name: 'Mysore Palace', postedBy: 'chirag', description: 'Indo-Saracenic palace, completed in 1912, with a grand durbar hall and weekly illuminations.', address: 'Sayyaji Rao Rd, Agrahara, Chamrajpura, Mysuru, Karnataka 570001', url: "https://lh5.googleusercontent.com/p/AF1QipOxM9k1RkWMiEPLGKjZFhMXu6YSkenS0KtlyZLn=w408-h306-k-no", liked: false, n_likes: 0, location: {
            lng: 12.3051682,
            lat: 76.6529862
        }, creatorID: 'u1', postDate: 'sun jul 03 2022'
    }
]

const getPlaceById = (req, res, next) => {
    const { pid } = req.params;
    const foundPlace = dummyPlace.find(p => p.id === pid);
    //triggering error handling middleware using Error Model-HttpError()
    if (!foundPlace) {
        return next(new HttpError('Could not find the place with provided pid.', 404))//404-not found
    }
    res.json(foundPlace)
}

const getPlacesByUserId = (req, res, next) => {
    const { uid } = req.params;
    const foundPlaces = dummyPlace.filter(p => p.creatorID === uid);
    //triggering error handling middleware using Error Model-HttpError()
    if (!foundPlaces || foundPlaces.length === 0) {
        return next(new HttpError('Could not find the places with provided pid.', 404))
    }
    res.json(foundPlaces)
}

const createPlace = (req, res, next) => {
    const Result=validationResult(req)
    if(!Result.isEmpty()){
        return next(new HttpError(Result.errors[0].msg,422))
    }
    const date=new Date() 
    const day =date.getDate()
    const month =date.getMonth()+1
    const year =date.getFullYear()
    console.log()
    const { name, description, address, url, location, creatorID } = req.body
    const createdPlace = { id:uuidv4(), name, description, address, url, liked:false, n_likes:0, location, creatorID, postDate:`${day}-${month}-${year}` }
    dummyPlace.push(createdPlace)
    res.status(201).json(dummyPlace)
}

const updatePlace = (req, res, next) => {
    const { pid } = req.params;
    const { name, description, address, url, location } = req.body
    const updatedPlace = { name, description, address, url, location }
    dummyPlace = dummyPlace.map(p => {
        if (p.id === pid) {
            return { ...p, ...updatedPlace }
        } else {
            return p
        }
    })
    res.status(200).json({ place: updatedPlace, dummyPlace: dummyPlace })
}

const deletePlace= (req, res, next) => {
    const {pid} =req.params
    dummyPlace=dummyPlace.filter(p => p.id !== pid)
    res.status(200).json({message:"places Deleted"})
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace