const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const HttpError = require('./models/http-error')
const placesRouter = require('./routes/places-routes')
const usersRouter = require('./routes/users-routes')

//for parsing encoded data like data of form
// app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//for sending request to routes starting with /api/places/... 
app.use('/api/places', placesRouter)
app.use('/api/users', usersRouter)

//handling error for route not found
app.use((req, res, next) => {
    const error = new HttpError("could not find this route", 404)
    return next(error)
})

//error handling middleware
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500).json({ message: error.message || "An unknown error occurred" })
})

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    console.log(`Listening on port ${process.env.PORT}`)
).catch((err) => console.log(err))