const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  email: {
    type: String
  },
  title: {
    type: String
  },
  authors: {
    type: Array
  },
  publishedDate: {
    type: String
  },
  pageCount: {
    type: String
  },
  isbn: {
    type: String
  },
  group: {
    type: String
  },
  comment: {
    type: Array
  },
  time: { type: Date, default: Date.now }
})

const Books = mongoose.model('Books', bookSchema, 'Books');
module.exports = Books;