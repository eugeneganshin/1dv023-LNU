const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/register', authController.register)
router.post('/signup', authController.signup)

router.get('/login', authController.login)
router.post('/login', authController.loginPost)

module.exports = router
