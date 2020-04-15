'use strict'

const express = require('express')
const snippetsController = require('../controllers/snippetsController')
const authController = require('../controllers/authController')
// const { userOnly } = require('../lib/userOnly')
const router = express.Router()

router.get('/', authController.userOnly, snippetsController.index)

router.get('/new', snippetsController.new)

router.post('/create', authController.userOnly, snippetsController.create) // protect these routs

router.get('/:id/edit', authController.userOnly, snippetsController.edit) // protect these routs
router.post('/:id/update', authController.userOnly, snippetsController.update) // protect these routs

router.post('/:id/remove', authController.userOnly, snippetsController.delete) // protect these routs

module.exports = router
