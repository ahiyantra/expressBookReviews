
const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const PORT = 5000;

public_users.post("/register", (req,res) => {
  //Write your code here

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }
  // Assume you have a function to hash the password
  const hashedPassword = hashPassword(password);
  users[username] = { username, password: hashedPassword };
  return res.status(201).json({ message: "User registered successfully" });
  
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) { 
  //Write your code here
/*
  const bookList = Object.keys(books).map(isbn => books[isbn]);
  return res.status(200).json({ books: bookList });
*/
  // task 1 vs task 10

  try {
    const bookList = Object.keys(books).map(isbn => books[isbn]);
    return res.status(200).json({ books: bookList });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Error fetching books from the shop" });
  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) { 
  //Write your code here
/*
  const isbn = req.params.isbn;
  const bookDetails = books[isbn];
  if (bookDetails) {
    return res.status(200).json({ book: bookDetails });
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
*/
  // task 2 vs task 11

    try {
    const isbn = req.params.isbn;
    const bookDetails = books[isbn];

    if (bookDetails) {
      return res.status(200).json({ book: bookDetails });
    } else {
      return res.status(404).json({ message: "Book not found." });
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    return res.status(500).json({ message: "Error fetching book details" });
  }

 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) { 
  //Write your code here
/*
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(book => book.author === author);
  if (matchingBooks.length > 0) {
    return res.status(200).json({ book: matchingBooks });
  } else {
    return res.status(404).json({ message: "Books by the author not found." });
  }
*/
  // task 3 vs task 12

  try {
    const author = req.params.author;
    const matchingBooks = Object.values(books).filter(book => book.author === author);

    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "Books by the author not found." });
    }
  } catch (error) {
    console.error("Error fetching books by author:", error);
    return res.status(500).json({ message: "Error fetching books by author" });
  }

});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) { 
  //Write your code here
/*
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title === title);
  if (matchingBooks.length > 0) {
    return res.status(200).json({ book: matchingBooks });
  } else {
    return res.status(404).json({ message: "Books with the title not found." });
  }
*/
  // task 4 vs task 13

  try {
    const title = req.params.title;
    const matchingBooks = Object.values(books).filter(book => book.title === title);

    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "Books with the title not found." });
    }
  } catch (error) {
    console.error("Error fetching books by title:", error);
    return res.status(500).json({ message: "Error fetching books by title" });
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;
  // Assume you have a reviews object
  const reviews = {
    "1234567890": "Great book!",
    "9876543210": "Not bad"
    // Add more reviews as needed
  };
  const review = reviews[isbn];
  if (review) {
    return res.status(200).json({ review: review });
  } else {
    return res.status(404).json({ message: "Review for the book not found." });
  }

});

//  Home.
public_users.get('/books/',function (req, res) {
  //Write your code here

  return res.status(404).json({ message: "Empty page." });

});

module.exports.general = public_users;
