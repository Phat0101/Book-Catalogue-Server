const express = require('express');
const mongoose = require('mongoose');
const bp = require('body-parser');
const path = require('path');
const route = require('./Routes/route');
const cookierParser = require('cookie-parser');
const { AuthMiddleWare, checkUser } = require('./authMiddleware/authjwt');
require('dotenv').config();

app = express();
let port = process.env.PORT || 8080;
const dbURI = process.env.DBURI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));


app.use(express.static('Pages'));
app.use(express.static('Public'));
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cookierParser());

app.get('*', checkUser);
app.get('/home', AuthMiddleWare, (req, res) =>
  res.sendFile(path.join(__dirname, './Pages/Home.html'))
)
app.use(route);