const numbersController = {}
const numbers = [{ id: 1, name: '1' }]

numbersController.index = async (req, res) => {
  const viewData = { numbers }
  res.render('numbers/index', { viewData })
}
numbersController.new = async (req, res) => {
  res.render('numbers/new')
}
// numbersController.create = async (req, res) => {

// }
// numbersController.show = async (req, res, next) => {

// }

module.exports = numbersController
