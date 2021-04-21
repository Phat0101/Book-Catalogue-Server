const User = require('../Models/Users');
const path = require('path');
const jwt = require('jsonwebtoken');

const maxAge = 24 * 60 * 60;
const createWebToken = (id) => {
  return jwt.sign({ id }, 'ok', { expiresIn: maxAge });
}
const handleCreateUserError = (err) => {
  let errors = { email: '', password: '' };

  if (err.message === "Incorrect Email") {
    errors.email = "Email is not registered!";
  }
  if (err.message === "Incorrect Password") {
    errors.password = "Password is incorrect!"
  }
  //duplicate error code
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
  } else {
    //validation errors
    if (err.message != undefined) {
      if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
          errors[properties['path']] = properties.message;
        })
      }
    }
  }
  return errors;
}

module.exports.signup_get = (req, res) => {
  res.sendFile(path.join(__dirname, '../Pages/Signup.html'));
};

module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      'username': username,
      'email': email,
      'password': password
    })
    const token = createWebToken(user._id);
    res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
    res.cookie('username', user.username, { maxAge: maxAge * 1000, httpOnly: false });
    res.cookie('email', user.email, { maxAge: maxAge * 1000, httpOnly: false });
    if (user) { res.json({ user }) };
  } catch (error) {
    const errs = handleCreateUserError(error);
    res.status(400).json({ errs });
  }
};