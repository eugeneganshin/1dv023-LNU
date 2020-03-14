'use strict'

const moment = require('moment')

const index = (req, res) => {
  res.render('home/index')
}

const indexPost = (req, res) => {
  const viewData = {
    name: req.body.name,
    dayTime: moment().format('dddd')
  }

  throw new Error('Noooooo')
  res.render('home/index', { viewData })
}

module.exports = { index, indexPost }
