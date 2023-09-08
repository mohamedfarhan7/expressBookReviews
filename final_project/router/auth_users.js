const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let filteredUsers = users.filter(user => user.username === username);

    if (filteredUsers.length > 0)
        return false;
    return true;
}

const authenticatedUser = (username,password)=>{ 
    let filteredUsers = users.filter(user => user.username === username);

    if (filteredUsers.length > 0 && filteredUsers[0].password === password)
        return true;
    return false;

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (authenticatedUser(username, password)) {
            const accessToken = jwt.sign({
                username: username,
            }, "access", {expiresIn: 60});

            req.session.authorization = {
                accessToken: accessToken, data: password,
            };
            return res.status(200).json({"message": "User logged in successfully"});
        } else {
            return res.status(400).json({"message": "Username or Password incorrect"});
        }
    } else {
        return res.status(400).json({"message": "Login Error"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.user.username;
    const userReview = req.body.review;
    const isbn = req.params.isbn;
    if (userReview && books[isbn]) {
        let reviews = books[isbn].reviews;
        reviews[username] = userReview;
        books[isbn].reviews = reviews;
        return res.status(201).json({"message": "Review written successfully"});
    } else {
        return res.status(400).json({"message": "Error: Could not write review"});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.user.username;
    const isbn = req.params.isbn;

    if (books[isbn]) {
        let reviews = books[isbn].reviews;
        if (reviews[username]) {
            delete reviews[username];
            books[isbn].reviews = reviews;
            return res.status(200).json({"message": "Review deleted successfully"});
        } else {
            return res.status(404).json({"message": "Review not found"});
        }
    } else {
        return res.status(404).json({"message": "Book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

