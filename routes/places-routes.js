const express = require('express')
const router = express.Router()
const {check}=require('express-validator')

const placesController=require('../controllers/places-controllers')

router.get('/:pid',placesController.getPlaceById)

router.get('/user/:uid',placesController.getPlacesByUserId)

router.post('/',[
    check('name').not().isEmpty(),
    check('description').not().isEmpty()
    .isLength({min:5}).withMessage("description must be at least 5 characters long")
    .isLength({max:100}).withMessage("description must contain 100 characters maximum")
    ,
    check('address').not().isEmpty(),
    check('url').not().isEmpty()
],placesController.createPlace)

router.patch('/:pid',placesController.updatePlace)

router.delete('/:pid',placesController.deletePlace)

module.exports = router