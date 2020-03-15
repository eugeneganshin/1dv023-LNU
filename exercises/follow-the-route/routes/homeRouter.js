'use strict'
const express = require('express')
const router = express.Router()

const homeController = require('../controllers/homeController')

router.get('/', homeController.index)

router.get('/new', homeController.new)
router.post('/create', homeController.create)

router.get('/:id', homeController.show)

// router.post('/', homeController.indexPost)

module.exports = router
