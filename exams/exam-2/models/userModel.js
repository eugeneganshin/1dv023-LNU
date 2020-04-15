const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'The password must be of minimum length of 10 characters.']
  }
}, {
  timestamps: true,
  versionKey: false
})

userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login attempt')
  }

  return user
}

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

const User = mongoose.model('User', userSchema)
module.exports = User

// handle all inputs as strings
