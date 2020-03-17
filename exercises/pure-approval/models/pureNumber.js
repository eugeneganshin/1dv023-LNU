const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pureNumber = new Schema({
  value: {
    type: Number,
    required: '`{PATH}` is required!',
    max: [42, '`{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
    min: [1, '`{PATH}` ({VALUE}) is beneath the limit ({MIN}).']
  }
}, {
  timestamps: true,
  versionKey: false
})

const PureNumber = mongoose.model('PureNumber', pureNumber)

module.exports = PureNumber
