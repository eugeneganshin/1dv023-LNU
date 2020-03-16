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
    value: req.body.value,
    date: new Date()
  })

  res.redirect('.')
}
numbersController.show = async (req, res, next) => {
  const number = numbers
    .filter(number => number.value === req.params.val)
    .shift()

  if (!numbers) {
    const error = new Error('Not found')
    error.statusCode = 404

    return next(error)
  }

  const viewData = { number }
  res.render('numbers/show', { viewData })
}

module.exports = numbersController
