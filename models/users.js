const mongoose = require('mongoose')
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'Email address is required',
        unique: [true, 'Email already exist'],
        validate: [isEmail, 'invalid email']
    },
    posts: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }],//post ids
    url: {
        type: String,
        default: ""
    },
    coverURL: { type: String, default: "" },
    bio: {
        type: String,
        required: "This field is required",
        minLength: 5,
        maxLength: 100
    },
    password: { type: String, required: true, minLength: 8 }
})

const user = mongoose.model('User', userSchema)

module.exports = user