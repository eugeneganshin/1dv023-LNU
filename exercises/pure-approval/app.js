'use strict'
const createError = require('http-errors')
const express = require('express')
const favicon = require('serve-favicon')
const hbs = require('express-hbs')
const session = require('express-session')
const path = require('path')
const logger = require('morgan')

const mongoose = require('./configs/mongoose')

const app = express()

/**
 * Connect to mongoDB database.
 * Mongoose.connect returns a promise.
 */
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

/**
 * View engine setup.
 */
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

/**
 * Additional middleware.
 */
app.use(logger('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

/**
 * Session storage and flash.
 */
app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
})

/**
 * Routes.
 */
app.use('/', require('./routes/numbersRouter'))
app.use('*', (req, res, next) => next(createError(404)))
/**
 * Error handling.
 */
app.use((err, req, res, next) => {
  if (err.statusCode === 404) {
    return res
      .status(404)
      .sendFile(path.join(__dirname, 'views', 'errors', '404.html'))
  }

  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(path.join(__dirname, 'views', 'errors', '500.html'))
  }

  res
    .status(err.status || 500)
    .render('errors/error', { error: err })
})

app.listen(4000, () => console.log('Server is running at http://localhost:4000'))
