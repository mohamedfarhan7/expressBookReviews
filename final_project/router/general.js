const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username))
            return res.status(400).json({"message": "User already exists"});

        users.push({username, password});
        return res.status(201).json({"message": "User registered successfully"});
    } else {
        return res.status(400).json({"message": "Useranme and Password required"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn])
        return res.status(200).json(books[isbn]);
    return res.status(404).json({"message": "Book not Found"})
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0)
        return res.status(200).json(filteredBooks);
    return res.status(404).json({"message": "No books found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let filteredBooks = Object.values(books).filter(book => book.title === title);
    if (filteredBooks.length > 0)
        return res.status(200).json(filteredBooks);
    return res.status(404).json({"message": "No books found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn])
        return res.status(200).json(books[isbn].reviews);
    return res.status(404).json({"message": "Book not Found"})
});

module.exports.general = public_users;

