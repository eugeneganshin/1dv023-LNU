'use strict'

const express = require('express')
const homeController = require('../controllers/homeController')
const router = express.Router()

router.get('/', homeController.index)

router.get('/new', homeController.new)

router.post('/create', homeController.create)

router.get('/:id/edit', homeController.edit)
router.post('/:id/update', homeController.update)

router.post('/:id/remove', homeController.delete)

module.exports = router
