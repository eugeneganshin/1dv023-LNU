'use strict'

const moment = require('moment')
const PureNumber = require('../models/pureNumber')

const pureNumberController = {}

pureNumberController.index = async (req, res, next) => {
  try {
    const viewData = {
      pureNumbers: (await PureNumber.find({}))
        .map(pureNumber => ({
          id: pureNumber._id,
          createdAt: moment(pureNumber.createdAt).fromNow(),
          value: pureNumber.value
        }))
        .sort((a, b) => a.value - b.value)
    }
    res.render('numbers/index', { viewData })
    console.log(viewData.pureNumbers)
  } catch (err) {
    console.log(err)
  }
}

pureNumberController.new = async (req, res) => {
  const viewData = {
    value: undefined
  }

  res.render('numbers/new', { viewData })
}

pureNumberController.create = async (req, res) => {
  try {
    const pureNumber = new PureNumber({
      value: req.body.value
    })
    await pureNumber.save()

    // req.session.flash = { type: 'Success', text: 'The number was succesfully saved' }
    res.redirect('.')
  } catch (error) {
    console.log(error)
    return res.render('numbers/new', {
      validationErrors: [error.message] || [error.errors.value.message],
      value: req.body.value
    })
  }
}

module.exports = pureNumberController
