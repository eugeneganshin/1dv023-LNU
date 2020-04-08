const SnippetModel = require('../models/snippetModel')

const homeController = {}

homeController.index = async (req, res, next) => {
  try {
    const viewData = {
      snippets: (await SnippetModel.find({})).map(snippet => ({
        value: snippet.value
      }))
    }
    res.render('snippets/index', { viewData })
    console.log(viewData.snippets)
  } catch (err) {
    console.error(err)
  }
}

homeController.new = async (req, res) => {
  const viewData = {
    value: undefined
  }
  res.render('snippets/new', { viewData })
}

homeController.create = async (req, res) => {
  try {
    const snippets = new SnippetModel({
      value: req.body.inputText
    })
    await snippets.save()
    res.redirect('.')
  } catch (err) {
    console.error(err)
    return res.render('snippets/new', {
      validationErrors: [err.message] || [err.errors.value.message],
      value: req.body.inputText
    })
  }
}

module.exports = homeController
