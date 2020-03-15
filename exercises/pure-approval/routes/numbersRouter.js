const express = require('express')
const router = express.Router()

const numbersController = require('../controllers/numbersController')

router.get('/', numbersController.index)

router.get('/new', numbersController.new)
// router.post('/create')

// router.get('/:id')

module.exports = router
