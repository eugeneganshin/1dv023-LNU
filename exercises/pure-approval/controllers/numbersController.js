const moment = require('moment')

const numbersController = {}
const numbers = []

numbersController.index = async (req, res) => {
  const viewData = { numbers }
  res.render('numbers/index', { viewData })
}

numbersController.new = async (req, res) => {
  res.render('numbers/new')
}

numbersController.create = async (req, res) => {
  numbers.push({
    date: new Date(),
    value: req.body.value
  })

  res.redirect('.')
}
numbersController.show = async (req, res, next) => {
  const number = numbers
    .shift()

  const viewData = { number }
  res.render('numbers/show', { viewData })
}

module.exports = numbersController
