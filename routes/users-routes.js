const express = require('express')
const router= express.Router()

const usersController = require('../controllers/user-controller')

router.get('/',usersController.getUsers)
router.get('/login',usersController.loginUser)
router.post('/signup',usersController.signupUser)

module.exports =router