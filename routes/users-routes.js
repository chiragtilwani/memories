const express = require('express')
const { check } = require('express-validator')
const router = express.Router()

const usersController = require('../controllers/user-controller')

router.get('/', usersController.getUsers)
router.get('/user/:uid', usersController.getUserById)
router.post('/login', usersController.loginUser)
router.post('/signup', [
    check('name').not().isEmpty().withMessage('Name field is required'),
    check("email")
        .isEmail().withMessage("Not an Email").not().isEmpty().withMessage('Email field is required'),
    check('bio').not().isEmpty().withMessage('Bio field is required')
        .isLength({min:5}).withMessage("Bio must be at least 5 characters long")
        .isLength({max:100}).withMessage("Bio must be at most 100 characters long"),
    check('password').not().isEmpty().withMessage("Password field is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        
    ,
], usersController.signupUser)

module.exports = router