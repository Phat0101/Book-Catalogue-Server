const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: [true, 'Please enter your user name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email!'],
    unique: [true, 'This email has been used'],
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minLength: [6, 'Minimum password length is 6']
  }
})

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const check = await bcrypt.compare(password, user.password);
    if (check) {
      return user;
    }
    throw Error('Incorrect Password');
  }
  throw Error('Incorrect Email');
}

const User = mongoose.model('User', userSchema, 'Users');
module.exports = User;