// File handles login logic AND token creation

import jwt from 'jsonwebtoken';                             // Used to create JWT tokens
import bcrypt from 'bcryptjs';                              // used to hash and compare passwords securely 
import { setAuthCookie } from '../utils/setAuthCookie.js';  // method to set authentication cookie via JWT token

import { createUser, 
         findUserByUsername,
         findUserByEmail } from '../model/authModel.js'; // methods for finding and creating/registing user in database
// NOTE: 'findUserByGoogleId' and 'createUser' aren't used, only stored in authModel.js currently


export const loginUser = async (req, res, next) => { // Local login controller
  try {
    const { username, password } = req.body; // get username + password when user logs in (via req.body)

    const user = await findUserByUsername(username); // attempt to find user with matching username

    if (!user){ // If user is not found for username, return error message
        return res.status(401).json({ error: 'Invalid username' });
    } 

    const isMatch = await bcrypt.compare(password, user.password_hash); // checks is stored hased password matches 
                                                                        // hash of user provided password
                                                                        
    if (!isMatch){ // If password doesn't match, return 'invalid' message
        return res.status(401).json({ error: 'Invalid password' });
    } 

    const token = jwt.sign( //Otherwise, if login is successful, create JWT payload with user info (customizable)
        { id: user.id, username: user.username },  // JWT payload: what to encode (without sensitive info)
        process.env.JWT_SECRET,                    // JWT secret for signing (stored in .env) 
        { expiresIn: '24h' }                       // Token expires in 24 hours
    );

    setAuthCookie(res, token);  // Store token in secure, httpOnly cookie

    res.json({                                       // Send response back to client
        message: 'Login successful',                 // Optional message
        user: {id: user.id, username: user.username} // Optionally return public-safe user data
    }); // send success response
  } 
  catch (error) { // IF error caught, forward error to Express for handling
    next(error);
  }
};


export const logoutUser = (req, res) => { // Logout controller
  res.clearCookie('token');               // remove JWT cookie from browser
  req.logout(() => {                      // Passport logout/cleanup hook (used with sessions, but safe to include)
    res.json({ message: 'Logged out successfully' }); // Respond with Logout confirmation
  });
};


export const registerUser = async (req, res, next) => { // Registers a new user via username/email/password (local signup)
  try {
    const { username, email, password } = req.body; // extracts username, email, password from request body

    const existingUser = await findUserByUsername(username); // Check if username already exists in database
    if (existingUser) { 
         return res.status(409).json({ error: 'Username already taken' }); // respond with conflict error 
    }

    const duplicateEmail = await findUserByEmail(email); // Check if email already exists in database  
    if (duplicateEmail) { 
         return res.status(409).json({ error: 'Email already registered' }); // respond with conflict error
    }

    const passwordHash = await bcrypt.hash(password, 10); // Securely hash the password with salt rounds = 10

    const newUser = await createUser({ username, email, passwordHash }); // Create ad insert new user into database


    // NOTE: below snippet commented out to prevent new user from being logged in
    //       prior to new user logging in in the LoginPage normally.
      
    //const token = jwt.sign(                             // Issue a JWT token for new user
    //    { id: newUser.id, username: newUser.username }, // JWT payload (without sensitive info)
    //    process.env.JWT_SECRET,                         // JWT secret key from environment config (in .env) 
    //    { expiresIn: '24h' }                            // Token expires in 24 hours
    //);
    //setAuthCookie(res, token); // Set token in secure, httpOnly cookie

    res.status(201).json({  // Upon successful registration, return new user on login
        message: 'Registration successful', 
        user: { id: newUser.id, username: newUser.username } 
    });
  } 
  catch (err) { // If error caught, forward error to Express for handling
    next(err);
  }
};


export const handleGoogleCallback = async (req, res) => { // Google OAuth callback logic

  try {
    const user = req.user; // Passport attaches authenticated user to req.user

    const token = jwt.sign(  // Create JWT for logged-in Google user WITH user's ID + username (customizable)
        { id: user.id, username: user.username },  // JWT payload: what to encode (without sensitive info)
        process.env.JWT_SECRET,                    // JWT secret key for signin token (stored in .env) 
        { expiresIn: '24h' }                       // Token expires in 24 hours
    );

    setAuthCookie(res, token);  // Store token as secure httpOnly cookie

    res.redirect(process.env.CLIENT_HOME_URL || '/'); // Redirect to frontend after login 
                                                     // redirect customizable via .env
  } 
  catch (err) { // Error if OAuth failed
    res.status(500).json({ error: 'Google OAuth failed' });
  }
};