'use strict'

const productsController = {}
const products = [{ id: 1, name: 'Phone' }]

productsController.index = (req, res) => {
  const viewData = { products }
  res.render('products/index', { viewData })
}

productsController.new = async (req, res) => {
  res.render('products/new')
}

productsController.create = async (req, res) => {
  products.push({
    id: products.length + 1,
    name: req.body.name
  })

  res.redirect('.')
}
productsController.show = async (req, res, next) => {
  const product = products
    .filter(product => product.id === Number(req.params.id))
    .shift()
  console.log(req.param + ' req.param')
  console.log(Number(req.params.id) + ' req.param.id')
  if (!product) {
    const error = new Error('Not found')
    error.statusCode = 404

    return next(error)
  }

  const viewData = { product }
  res.render('products/show', { viewData })
}

module.exports = productsController
