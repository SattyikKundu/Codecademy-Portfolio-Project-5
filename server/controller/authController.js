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

    //console.log('[LOGIN] Received login attempt:', req.body);

    if (!username?.trim() || !password?.trim()) { // Check for empty/missing fields (trim() for whitespace-only cases)
      return res.status(400).json({ error: 'One or both fields are empty.' });
    }

    const user = await findUserByUsername(username); // attempt to find user with matching username

    if (!user){ // If user is not found for username, return error message
        return res.status(401).json({ error: 'Invalid username.' });
    } 

    const isMatch = await bcrypt.compare(password, user.password_hash); // checks is stored hased password matches 
                                                                        // hash of user provided password
                                                                        
    if (!isMatch){ // If password doesn't match, return 'invalid' message
        return res.status(401).json({ error: 'Invalid password.' });
    } 

    const token = jwt.sign( //Otherwise, if login is successful, create JWT payload with user info (customizable)
        { id: user.id,                 // user id
          username: user.username,     // username
          email: user.email            // user's email (important at checkout) 
        },                             // JWT payload: what to encode (without sensitive info)
        process.env.JWT_SECRET,        // JWT secret for signing (stored in .env) 
        { expiresIn: '24h' }           // Token expires in 24 hours
    );

    //console.log('[LOGIN] Created token:', token);

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

  /* NOTE: For logout to fully work, it needs to match/parallel the values set in the setAuthCookie.js.
   *       Otherwise, the deletion of cookie may failif specified cookie to clear doesn't match 
   *       existing cookie stored in browser. "res.clear('token');" is too simple and various Browsers, like
   *       Chrome, may not accept a match.
   */     

  const isProduction = process.env.NODE_ENV === 'production'; // Detect environment mode
  res.clearCookie('token', {                  
    httpOnly: true,                             // MUST match how it was originally set
    secure: isProduction,                       // set to true if using HTTPS in production
    sameSite: isProduction ? 'none' : 'lax',    // 'none' ensures that cookies aren't blocked on cross-site requests
    //sameSite: isProduction ? 'strict' : 'lax',  // or 'Strict' is used in setAuthCookie
    path: '/'                                   // MUST match path also set in setAuthCookie
  });

  // res.clearCookie('token');               // remove JWT cookie from browser
  // req.logout(() => {                      // Passport logout/cleanup hook (used with sessions, but safe to include)
  //   res.json({ message: 'Logged out successfully!' }); // Respond with Logout confirmation
  // });
  return res.status(200).json({ success: true, message: "Logged out successfully!" });
};


export const registerUser = async (req, res, next) => { // Registers a new user via username/email/password (local signup)
  try {
    const { username, email, password } = req.body; // extracts username, email, password from request body

    if (!username?.trim() || !email?.trim() || !password?.trim()) { // Check for empty/missing fields 
                                                                    // (trim to handle whitespace-only cases)
      return res.status(400).json({ error: 'One or more fields are empty.' });
    }

    const existingUser = await findUserByUsername(username); // Check if username already exists in database
    if (existingUser) { 
         return res.status(409).json({ error: 'Username already taken.' }); // respond with conflict error 
    }

    const duplicateEmail = await findUserByEmail(email); // Check if email already exists in database  
    if (duplicateEmail) { 
         return res.status(409).json({ error: 'Email already registered.' }); // respond with conflict error
    }

    const passwordHash = await bcrypt.hash(password, 10); // Securely hash the password with salt rounds = 10

    const newUser = await createUser({ username, email, passwordHash }); // Create ad insert new user into database


    // NOTE: below snippet commented out to prevent new user from being logged in
    //       before the new user actually logs into the LoginPage normally.
      
    // const token = jwt.sign(                             // Issue a JWT token for new user
    //     { id: newUser.id, username: newUser.username }, // JWT payload (without sensitive info)
    //     process.env.JWT_SECRET,                         // JWT secret key from environment config (in .env) 
    //     { expiresIn: '24h' }                            // Token expires in 24 hours
    // );
    // setAuthCookie(res, token); // Set token in secure, httpOnly cookie 

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

   /* redirect to profile page after successful google oauth login
    * NOTE: redirect url might change depending on CLIENT_HOME_URL in the .env file 
    */
    res.redirect(`${process.env.CLIENT_HOME_URL}/profile?loginSuccess=1`); 

    //res.redirect(process.env.CLIENT_HOME_URL || '/'); // Redirect to frontend after login 
                                                        // redirect customizable via .env
  } 
  catch (err) { // Error if OAuth failed
    res.status(500).json({ error: 'Google OAuth failed' });
  }
};