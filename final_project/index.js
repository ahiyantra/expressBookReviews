const net = require('net');
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Use the genl_routes for the '/' path
app.use('/', genl_routes);

app.use('/', customer_routes);


app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
	  // Check if the user is authenticated using session
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // If the session is valid, check the access token
  const accessToken = req.session?.user?.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  // Verify the access token
  jwt.verify(accessToken, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    // If the access token is valid, proceed to the next middleware
    next();
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
