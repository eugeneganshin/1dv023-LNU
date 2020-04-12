const User = require('../models/userModel')
const SnippetModel = require('../models/snippetModel')

const homeController = {}

homeController.index = async (req, res) => {
  res.render('home/index')
}

homeController.snippets = async (req, res) => {
  try {
    const viewData = {
      snippets: (await SnippetModel.find({})).map(snippet => ({
        value: snippet.value,
        id: snippet._id
      }))
    }
    res.render('home/snippets', { viewData })
  } catch (err) {
    console.error(err)
  }
}

module.exports = homeController
