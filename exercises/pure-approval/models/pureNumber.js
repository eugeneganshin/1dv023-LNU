const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pureNumber = new Schema({
  value: {
    type: Number,
    required: '`{PATH}` is required!',
    max: [42, '{VALUE} exceeds the limit of {MAX}.'],
    min: [1, '{VALUE} is beneath the limit of {MIN}.']
  }
}, {
  timestamps: true,
  versionKey: false
})

const PureNumber = mongoose.model('PureNumber', pureNumber)

module.exports = PureNumber
