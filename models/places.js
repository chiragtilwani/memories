const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    postedBy: { type: String },//creatorID add by us while creating new place
    description: { type: String, required: true, minLength: 5, maxLength: 100 },
    address: { type: String, required: true },
    url: { type: String, required: true },
    likes: [],//arrays of user ids
    postDate: String
})

const place = mongoose.model('Place', placeSchema)

module.exports = place