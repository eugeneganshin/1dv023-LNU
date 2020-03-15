'use strict'

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

app.listen(4000, () => console.log('Server is running'))
