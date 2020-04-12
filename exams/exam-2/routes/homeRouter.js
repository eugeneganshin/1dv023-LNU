const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')
const snippetsController = require('../controllers/snippetsController')

router.get('/', homeController.index)
router.get('/snippets', homeController.snippets)

module.exports = router
