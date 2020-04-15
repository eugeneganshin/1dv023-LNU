'use strict'

require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const favicon = require('serve-favicon')
const hbs = require('express-hbs')
const session = require('express-session')
const path = require('path')
const logger = require('morgan')
const helpersPackage = require('handlebars-helpers')
const strings = helpersPackage.string()
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const mongoose = require('./configs/mongoose')

const app = express()

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
 * HBS helpers.
 */
hbs.registerHelper('startsWith', strings.startsWith)
hbs.registerHelper('replace', strings.replace)

/**
 * Global middlewares.
 */
app.use(helmet()) // security http headers

const limiter = rateLimit({
  // If your API requires a lot of request change the options.
  max: 100,
  windowMs: 1000 * 60 * 60, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour.'
})
app.use('/auth', limiter)

/**
 * Additional middleware.
 */
app.use(logger('dev'))

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false }))
app.use(xss())

/**
 * Serve static files.
 */
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

/**
 * Mongoose connection and sanitization.
 */
app.use(mongoSanitize())
mongoose.connect().catch(err => {
  console.error(err)
  process.exit(1)
})

/**
 * Express session options.
 */
const sessionOptions = {
  name: process.env.COOKIE_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30, // one month
    httpOnly: true
  }
}
app.use(session(sessionOptions))
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.userId = req.session.userId
  }
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  console.log(req.sessionID)
  next()
})

/**
 * Routes.
 */
app.use('/', require('./routes/homeRouter'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/user', require('./routes/snippetsRouter'))
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

  if (err.statusCode === 403) {
    return res
      .status(403)
      .sendFile(path.join(__dirname, 'views', 'errors', '403.html'))
  }

  // Not working unless you change NODE_ENV to production
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
