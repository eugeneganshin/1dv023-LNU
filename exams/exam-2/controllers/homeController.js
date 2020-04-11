const User = require('../models/userModel')

const homeController = {}

// Home
homeController.index = async (req, res) => {
  res.render('home/index')
  // console.log(Object.entries(User))
}

homeController.register = async (req, res) => {
  res.render('home/register')
}

// Register
homeController.signup = async (req, res) => {
  try {
    // console.log(req.body)
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    await newUser.save()
    console.log(newUser)
    // res.cookie('param1', 'param2')
    // store userdata in session store
    res.redirect('/login')
  } catch (err) {
    console.error(err)
    // test when done with form
    req.session.flash = { type: 'danger', text: err.message }
    res.redirect('/register')
  }
}

homeController.login = async (req, res) => {
  res.render('home/login')
}
homeController.loginPost = async (req, res) => {
  try {
    const user = await User.authenticate(req.body.username, req.body.password)
    const id = user.id
    console.log(id)
    // req.sessions.regenerate(() => {
    //   console.log('regenerate')
    // })
    // add _id to sessions and redirect to route that needs the id
    res.redirect('/login')
  } catch (err) {
    console.error(err)
    req.session.flash = { type: 'danger', text: err.message }
    res.redirect('/login')
  }
}

// Login
homeController.registerPost = async (req, res) => {
  res.send('ok')
  // send new cookie
  // redirect to whatever
}

module.exports = homeController
