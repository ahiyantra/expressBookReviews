const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = {"username":"password"};

const isValid = (username)=>{                       //returns boolean

    //write code to check is the username is valid

    return Object.keys(users).includes(username);

}

const authenticatedUser = (username,password)=>{    //returns boolean

//write code to check if username and password match the one we have in records.

  // Check if the username exists in the users object
  if (!Object.keys(users).includes(username)) {
    return false;
  }

  // Check if the provided password matches the stored password
  return users[username] === password;

}

// only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required", credentials: users[username]  });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "Username not found", credentials: users[username]  });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password", username, password  });
  }

  //const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

  //req.session.username = username;

  //return res.status(200).json({ token });

  return res.status(200).json({ message: "Custommer successfully logged in."});
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Extract necessary information from the request
  //const { username } = req.session.username;
  const username = req.params.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review is required in the query parameters" });
  }

  // Check if the book with the provided ISBN exists

    let updatedBooks = {};
    Object.keys(books).forEach(key => {
      updatedBooks[books[key].isbn] = books[key];
  });

  const isbnVal = req.params.isbn;
  const bookDetails = updatedBooks[isbnVal];

  if (!bookDetails) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or modify the review for the specified book and user
  bookDetails.reviews[username] = review;

  // Update the original books object with the modified copy
  books = bookDetails;

  return res.status(200).json({ message: "Review added or modified successfully" });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  
  //const { username } = req.session;
  const username = req.params.username;
  const isbn = req.params.isbn;

  // Assume you don't have a reviews object.
  // Replace reviews reeference with books reference.

  let updatedBooks = {};
    Object.keys(books).forEach(key => {
      updatedBooks[books[key].isbn] = books[key];
  });

  if (updatedBooks[isbn].reviews) {
    delete updatedBooks[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully"});
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

//  Get book reviews based on ISBN.
regd_users.get('/auth/review/:isbn',function (req, res) {
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

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
