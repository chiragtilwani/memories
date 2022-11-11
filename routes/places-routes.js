const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const placesController = require('../controllers/places-controllers')
const AuthMiddleware=require('../middleware/auth-middleware')


router.get('/',placesController.getAllPlaces)

router.get('/:pid', placesController.getPlaceById)

router.get('/user/:uid', placesController.getPlaceByUserId)

router.use(AuthMiddleware)//protecting below routes

router.post('/', [
    check('name').not().isEmpty(),
    check('description').not().isEmpty()
        .isLength({ min: 5 }).withMessage("description must be at least 5 characters long")
    ,
    check('address').not().isEmpty(),
    check('url').not().isEmpty()
], placesController.createPlace)

router.patch('/:pid',
    [
        check('name').not().isEmpty(),
        check('description').not().isEmpty()
            .isLength({ min: 5 }).withMessage("description must be at least 5 characters long")
            .isLength({ max: 100 }).withMessage("description must not contain more than 100 characters")
        ,
        check('address').not().isEmpty(),
        check('url').not().isEmpty()
    ],
    placesController.updatePlace)

router.delete('/:pid', placesController.deletePlace)

module.exports = router