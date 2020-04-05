'use strict'

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('snippets/index')
})

module.exports = router
