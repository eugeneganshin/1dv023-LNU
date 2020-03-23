'use strict'

const mongoose = require('mongoose')

module.exports.connect = async () => {
  mongoose.connection.on('connected', () => console.log('Conneciton is open'))
  mongoose.connection.on('error', err => console.error(`Connection error ${err}`))
  mongoose.connection.on('disconnected', () => console.log('Connection is disconnected'))

  // SIGINT = Ctrl-C (If Node process ends, close connection).
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Connection is disconnected due to application termintaion')
      process.exit(0)
    })
  })

  // Returns a promise.
  return mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}
