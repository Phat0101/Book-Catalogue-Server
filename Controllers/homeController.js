const User = require('../Models/Users');
const Book = require('../Models/Books');
const path = require('path');
const fetch = require('node-fetch');

const convertRawtoBook = (data) => {
  return {
    'title': data['title'],
    'authors': data['authors'],
    'publishedDate': data['publishedDate'],
    'pageCount': data['pageCount'],
    'industryIdentifiers': data['industryIdentifiers'],
    'category': '',
    'comment': []
  };
};

module.exports.isbn_post = async (req, res) => {
  let isbn = req.body.isbn;
  let email = req.body.email;
  let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyAW-3XXEh4ADE7216zwyYYB_zUz45fy6YQ`;
  try {
    const find = await Book.findOne({ 'isbn': isbn, 'email': email }) || 'not found';
    if (find == 'not found') {
      fetch(url, { method: "GET" })
        .then(res => res.json())
        .then((data) => {
          if (data['totalItems'] != 0) {
            data = data["items"][0]["volumeInfo"] || '';
            data = convertRawtoBook(data);
            res.json(data);
          } else {
            res.json('fetch failed');
          }
        })
    } else {
      let data = JSON.parse(JSON.stringify(find));
      data.found = 'found';
      res.json(data);
    }
  } catch (err) {
    console.log(err);
  }

};

module.exports.add_book_post = async (req, res) => {
  let book = req.body.book;
  let isbn = book['isbn'];
  let email = book['email'];
  try {
    const find = await Book.findOne({ 'isbn': isbn, 'email': email }) || 'not saved';
    if (find == 'not saved') {
      const bookSaved = await Book.create(book);
      console.log(bookSaved);
      res.json(bookSaved);
    } else {
      res.json('Book is already saved');
    }
  } catch (error) {
    res.status(400).json({ 'errs': "Cannot save in mongodbd" });
  }
}

module.exports.add_comment_post = async (req, res) => {
  let comment = req.body.comment;
  let email = req.body.email;
  let isbn = req.body.isbn;
  try {
    const getpreviouscomment = await Book.findOne({ 'isbn': isbn, 'email': email }) || 'not found';
    if (getpreviouscomment != 'not found') {
      let comments = getpreviouscomment['comment'];
      comments.unshift(comment);
      console.log(comments);
      const find = await Book.findOneAndUpdate({ 'isbn': isbn, 'email': email }, { 'comment': comments }, { new: true }) || 'not found';
      if (find == 'not found') {
        res.json({ 'errs': 'Book not added yet' });
      } else {
        res.json(find);
      };
    } else {
      res.json({ 'errs': 'Book not added yet' });
    }
  } catch (error) {
    res.status(400).json({ 'errs': "Cannot add comment to mongodb" });
  }
};

module.exports.add_group_post = async (req, res) => {
  let group = req.body.group;
  let isbn = req.body.isbn;
  let email = req.body.email;
  console.log(group);
  try {
    const find = await Book.findOneAndUpdate({ 'isbn': isbn, 'email': email }, { 'group': group }, { new: true }) || 'not found';
    if (find == 'not found') {
      res.json({ 'errs': 'Book not added yet' });
    } else {
      res.json(find);
    }
  } catch (error) {
    res.status(400).json({ 'errs': 'Cannot add group to mongodb' });
  }
};

module.exports.update_history = async (req, res) => {
  const email = req.body.email;
  try {
    const books = await Book.find({ 'email': email });
    res.json(books)
  } catch (error) {
    res.status(400).json({ 'errs': 'Cannot find history' })
  };

};

module.exports.delete_book_post = async (req, res) => {
  const isbn = req.body.isbn;
  const email = req.body.email;
  try {
    const confirm = await Book.findOneAndDelete({ 'email': email, 'isbn': isbn }) || 'not found';
    if (confirm == 'not found') {
      res.json({'errs': 'Book not added yet'})
    } else {
      console.log('successfully deleted');
      res.json(confirm);
    }
  } catch (error) {
    res.status(400).json({ 'errs': 'Cannot delete that book' })
  }

}