const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')

router.get('/', homeController.index) // GET

router.get('/register', homeController.register) // GET
router.post('/signup', homeController.signup) // POST

router.get('/login', homeController.login) // GET
router.post('/login/auth', homeController.loginPost) // POST

module.exports = router
