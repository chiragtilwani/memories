const express = require('express')
const {check} = require('express-validator')
const router= express.Router()

const usersController = require('../controllers/user-controller')

router.get('/',usersController.getUsers)
router.post('/login',usersController.loginUser)
router.post('/signup',[
    check('name').not().isEmpty(), 
    check("email").not().isEmpty()
    .isEmail().withMessage("Not an Email"),
    check('url').not().isEmpty(),
    check('coverURL').not().isEmpty(),
    check('bio').not().isEmpty(),
    check('password').not().isEmpty()
    .isLength({min:8}).withMessage("Password must be at least 8 characters long")
    ,
],usersController.signupUser)

module.exports =router