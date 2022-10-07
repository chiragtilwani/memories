const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const placesRouter= require('./routes/places-routes')

//for parsing encoded data like data of form
app.use(bodyParser.urlencoded({extended:false}))

//for sending request to routes starting with /api/places/... 
app.use('/api/places',placesRouter)

//error handling middleware
app.use((error,req,res,next) => {
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500).json({message:error.message || "An unknown error occurred"})
})


app.listen(5000);