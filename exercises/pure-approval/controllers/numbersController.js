const moment = require('moment')
const PureNumber = require('../models/pureNumber')

const numbersController = {}

numbersController.index = async (req, res, next) => {
  try {
    const viewData = {
      number: (await PureNumber.find({}))
        .map(number => ({
          id: number._id,
          createdAt: moment(number.createdAt).fromNow(),
          value: number.value
        }))
    }
    res.render('numbers/index', { viewData })
  } catch (err) {
    console.error(err)
    next(err)
  }
}

numbersController.new = async (req, res) => {
  const viewData = {
    value: undefined
  }
  res.render('numbers/new', { viewData })
}

numbersController.create = async (req, res) => {
  try {
    const number = new PureNumber({
      value: req.body.value
    })
    await number.save()
    req.session.flash = {
      type: 'Success.',
      text: 'Your number was created.'
    }
    res.redirect('.')
  } catch (error) {
    console.error(error)
  }
}

module.exports = numbersController
