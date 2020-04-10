const SnippetModel = require('../models/snippetModel')

const snippetsController = {}

// Index GET
snippetsController.index = async (req, res, next) => {
  try {
    const viewData = {
      snippets: (await SnippetModel.find({})).map(snippet => ({
        value: snippet.value,
        id: snippet._id
      }))
    }
    res.render('snippets/index', { viewData })
    // console.log(viewData.snippets)
  } catch (err) {
    console.error(err)
  }
}

// Controllers below should go to separate controller

// New GET
snippetsController.new = async (req, res) => {
  const viewData = {
    value: undefined
  }
  res.render('snippets/new', { viewData })
}

// Create POST
snippetsController.create = async (req, res) => {
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

// Edit GET
snippetsController.edit = async (req, res) => {
  try {
    console.log(req.params.id)
    const result = await SnippetModel.findOne({ _id: req.params.id })
    const viewData = {
      value: result.value,
      id: result._id
    }

    res.render('snippets/edit', { viewData })
  } catch (err) {
    res.redirect('.')
    console.error(err)
  }
}
// Edit POST
snippetsController.update = async (req, res) => {
  try {
    const result = await SnippetModel.updateOne({ _id: req.body.id }, {
      value: req.body.value
    })

    if (result.nModified === 1) {
      console.log('Has been modified')
    } else {
      console.log('Hasnt been modified')
    }
    res.redirect('..')
  } catch (err) {
    console.error(err)
  }
}

snippetsController.delete = async (req, res) => {
  try {
    await SnippetModel.deleteOne({ _id: req.body.id })
    res.redirect('..')
  } catch (err) {
    console.error(err)
  }
}

module.exports = snippetsController
