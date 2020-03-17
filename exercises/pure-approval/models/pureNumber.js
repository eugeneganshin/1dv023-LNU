const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pureNumber = new Schema({
  value: {
    type: Number,
    required: true,
    max: 42,
    min: 1
  }
}, {
  timestamps: true,
  versionKey: false
})

const PureNumber = mongoose.model('PureNumber', pureNumber)

module.exports = PureNumber
