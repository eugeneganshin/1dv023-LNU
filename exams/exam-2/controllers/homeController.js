const homeController = {}

homeController.index = async (req, res) => {
  res.render('home/index')
}

module.exports = homeController
