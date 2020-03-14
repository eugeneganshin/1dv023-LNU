'use strict'

const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const logger = require('morgan')
const app = express()

// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// additional middleware
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))

// routes
app.use('/', require('./routes/homeRouter'))

// catch 404
app.use((req, res, next) => {
  res.status(404)
  res.sendfile(path.join(__dirname, 'public', '404.html'))
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'Internet server error')
})

// port
app.listen(8000, () => console.log('Server is running on the port 8000'))
