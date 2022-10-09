const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true, minLength: 5},
    address: { type: String, required: true },
    url: { type: String, required: true },
    likes: [],//arrays of user ids
    creatorID: { type: String },//creatorID add by us while creating new place
    postDate: String
})

const place = mongoose.model('Place', placeSchema)

module.exports = place