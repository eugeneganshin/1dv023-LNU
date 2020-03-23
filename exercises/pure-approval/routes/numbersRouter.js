'use strict'
const express = require('express')
const router = express.Router()

const controller = require('../controllers/numbersController')

router.get('/', controller.index)
router.get('/new', controller.new)
router.post('/create', controller.create)

module.exports = router
