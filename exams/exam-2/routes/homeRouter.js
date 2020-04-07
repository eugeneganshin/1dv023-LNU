'use strict'

const express = require('express')
const hController = require('../controllers/homeController')
const router = express.Router()

router.get('/', hController.index)
router.post('/', hController.indexPost)

module.exports = router
