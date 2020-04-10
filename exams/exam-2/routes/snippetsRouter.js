'use strict'

const express = require('express')
const snippetsController = require('../controllers/snippetsController')
const router = express.Router()

router.get('/', snippetsController.index)

router.get('/new', snippetsController.new)

router.post('/create', snippetsController.create)

router.get('/:id/edit', snippetsController.edit)
router.post('/:id/update', snippetsController.update)

router.post('/:id/remove', snippetsController.delete)

module.exports = router
