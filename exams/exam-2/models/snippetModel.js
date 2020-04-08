const mongoose = require('mongoose')
const Schema = mongoose.Schema

const snippetModel = new Schema({
  value: {
    type: String,
    required: '`{PATH}` is required!',
    minlength: [1, '{VALUE} is below the limit of {MINLENGTH}'],
    maxlength: [300, '{VALUE} exceeds the limit of {MAXLENGTH}']
  },
  // timestamps: true,
  versionKey: false
})

const SnippetModel = mongoose.model('SnippetModel', snippetModel)

module.exports = SnippetModel
