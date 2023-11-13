
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
  //const hashedPassword = require('crypto').createHash('sha256').update(password).digest('hex');
  //const hashedPassword = hashPassword(password);
  
  users[username] = { username, password };
  return res.status(201).json({ message: "User registered successfully", credentials: users[username] });
  
});

// Get the book list available in the shop.
public_users.get('/', async function (req, res) { 
  //Write your code here
/*
  const bookList = Object.keys(books).map(isbn => books[isbn]);
  return res.status(200).json({ books: bookList });
*/
  // task 1 vs task 10

  try {
    const bookList = Object.keys(books).map(isbn => books[isbn]);
    return res.status(200).json(bookList);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Error fetching books from the shop" });
  }

});

// Get book details based on ISBN.
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here

  let updatedBooks = {};
    Object.keys(books).forEach(key => {
      updatedBooks[books[key].isbn] = books[key];
  });

  const isbnVal = req.params.isbn;
  const bookDetails = updatedBooks[isbnVal];
  if (bookDetails) {
    return res.status(200).json(bookDetails);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }

  // task 2 vs task 11

 });
  
// Get book details based on author.
public_users.get('/author/:author', async function (req, res) { 
  //Write your code here


  let updatedBooks = {};
    Object.keys(books).forEach(key => {
      updatedBooks[books[key].author] = books[key];
  });

  const authorVal = req.params.author;
  const matchingBooks = Object.values(updatedBooks).filter(book => book.author === authorVal);

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "Books by the author not found." });
  }

  // task 3 vs task 12
/*

*/
});

// Get all books based on title.
public_users.get('/title/:title', async function (req, res) { 
  //Write your code here


  let updatedBooks = {};
    Object.keys(books).forEach(key => {
      updatedBooks[books[key].title] = books[key];
  });

  const titleVal = req.params.title;
  const matchingBooks = Object.values(updatedBooks).filter(book => book.title === titleVal);

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "Books with the title not found." });
  }

  // task 4 vs task 13
/*

*/
});

//  Get book reviews based on ISBN.
public_users.get('/reviews/:isbn',function (req, res) {
  //Write your code here

  let updatedBooks = {};
    Object.keys(books).forEach(key => {
      updatedBooks[books[key].isbn] = books[key];
  });

  const isbnVal = req.params.isbn;
  // Assume you have a reviews object

  const matchingReviews = updatedBooks[isbnVal];
  if (matchingReviews) {
    return res.status(200).json(matchingReviews.reviews);
  } else {
    return res.status(404).json({ message: "Review for the book not found." });
  }

});

//  Home.
public_users.get('/books/', async function (req, res) { 
  //Write your code here
/*
  const bookList = Object.keys(books).map(isbn => books[isbn]);
  return res.status(200).json({ books: bookList });
*/
  // task 1 vs task 10

  try {
    const bookList = Object.keys(books).map(isbn => books[isbn]);
    return res.status(200).json(bookList);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Error fetching books from the shop" });
  }

});

module.exports.general = public_users;
