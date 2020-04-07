'use strict'

const mongoose = require('mongoose')

module.exports.connect = async () => {
  mongoose.connection.on('connected', () => console.log('Connection is open'))
  mongoose.connection.on('error', err => console.error(`Connection error ${err}`))
  mongoose.connection.on('disconnected', () => console.log('Connection is dosconnected'))

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Connection is closed due to application termination')
      process.exit(0)
    })
  })

  return mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}
