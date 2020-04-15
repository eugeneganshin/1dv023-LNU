const User = require('../models/userModel')

const authController = {}

authController.register = async (req, res) => {
  res.render('auth/register')
}

authController.signup = async (req, res) => {
  try {
    // check if the user already exists and if so let the client know????

    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    await newUser.save() // also hashes the password

    req.session.flash = { type: 'success', text: 'You have been registered.' }
    res.redirect('/auth/login')
  } catch (err) {
    console.error(err)
    req.session.flash = { type: 'danger', text: err.message }
    res.redirect('/register')
  }
}

authController.login = async (req, res) => {
  res.render('auth/login')
}
authController.loginPost = async (req, res) => {
  try {
    const user = await User.authenticate(req.body.username, req.body.password)
    await req.session.regenerate((err) => {
      if (err) {
        console.log(err)
        return res.redirect('/auth/login')
      }
      req.session.userId = user._id
      res.redirect('/user')
    })
  } catch (err) {
    console.error(err)
    req.session.flash = { type: 'danger', text: err.message }
    res.redirect('/auth/login')
  }
}

authController.logout = async (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/snippets')
    }

    res.clearCookie(process.env.COOKIE_NAME)
    res.redirect('/auth/login')
  })
}

authController.userOnly = async (req, res, next) => {
  // check if authorized
  if (!req.session.userId) {
    const error = new Error('Forbidden')
    error.statusCode = 403
    return next(error)
  }
  next()
  // expand the function when you add logout or change password

  // if connection has been restarted with mongoDB(i.e., server was restarded)
  // the cookie is lost. Use connect-mongo to prevent that (or Redis) and try JWT
}

module.exports = authController
