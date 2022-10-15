const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true, minLength: 5 },
    address: { type: String, required: true },
    url: { type: String, required: true },
    likes: [],//arrays of user ids
    creatorID: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    postDate: String
})

const place = mongoose.model('Place', placeSchema)

module.exports = place