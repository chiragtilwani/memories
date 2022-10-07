const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const placesRouter= require('./routes/places-routes')

app.use(bodyParser.urlencoded({extended:false}))
app.use('/api/places',placesRouter)

app.listen(5000);