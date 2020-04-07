const index = (req, res, next) => {
  res.render('snippets/index')
}

const indexPost = (req, res) => {
  const viewData = {
    text: req.body.inputText
  }
  console.log(req.body)
  res.render('snippets/index', { viewData })
}

module.exports = { index, indexPost }
