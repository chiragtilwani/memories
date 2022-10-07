const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const HttpError= require('./models/http-error')
const placesRouter= require('./routes/places-routes')

//for parsing encoded data like data of form
// app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//for sending request to routes starting with /api/places/... 
app.use('/api/places',placesRouter)

//handling error for route not found
app.use((req, res, next) => {
    const error =new HttpError("could not find this route",404)
    return next(error)
})

//error handling middleware
app.use((error,req,res,next) => {
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500).json({message:error.message || "An unknown error occurred"})
})


app.listen(5000);