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
    if (err.message.includes('User validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties['path']] = properties.message;
      })
    }
  }
  return errors;
}

module.exports.login_get = (req, res) => {
  res.sendFile(path.join(__dirname, '../Pages/Login.html'));
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.login(email, password);
    if (user) {
      const token = createWebToken(user._id);
      res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
      res.cookie('username', user.username, { maxAge: maxAge * 1000, httpOnly: false});
      res.cookie('email', user.email, { maxAge: maxAge * 1000, httpOnly: false });
      res.status(200).json({ user: user });
    }
  }
  catch (err) {
    const errs = handleCreateUserError(err);
    console.log(errs);
    res.status(400).json({ errs });
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
}