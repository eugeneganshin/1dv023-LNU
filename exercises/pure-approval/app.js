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

/**
 * Routes.
 */
app.use('/numbers', require('./routes/numbersRouter'))
app.use('*', (req, res, next) => next(createError(404)))

app.use((err, req, res, next) => {
  // 404 Not Found.
  if (err.statusCode === 404) {
    return res
      .status(404)
      .sendFile(path.join(__dirname, 'views', 'errors', '404.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(path.join(__dirname, 'views', 'errors', '500.html'))
  }

  // Development only!
  // Set locals, only providing error in development.

  // Render the error page.
  res
    .status(err.status || 500)
    .render('errors/error', { error: err })
})

app.listen(4000, () => console.log('Server is running'))
