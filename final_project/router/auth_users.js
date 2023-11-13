const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {"username":"password"};

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

    return Object.keys(users).includes(username);

}

const authenticatedUser = (username,password)=>{ //returns boolean
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

  const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
  req.session.username = username;

  return res.status(200).json({ token });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const { username } = req.session;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review is required in the query parameters" });
  }

  // Assume you have a reviews object
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added or modified successfully" });
  
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  
  const { username } = req.session;
  const isbn = req.params.isbn;

  // Assume you have a reviews object
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
