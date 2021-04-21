const jwt = require('jsonwebtoken');
const User = require('../Models/Users');

const AuthMiddleWare = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, 'ok', (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect('/Login');
      } else {
        next();
      }
    })
  } else {
    res.redirect('/Login');
  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'ok', async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    })
  } else {
    res.locals.user = null;
    next();
  }
}
module.exports = { AuthMiddleWare, checkUser };