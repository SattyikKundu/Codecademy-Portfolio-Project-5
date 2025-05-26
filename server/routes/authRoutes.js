// Routes for handling authentication

import express from 'express';   // Imported framework for defining routes
import passport from 'passport'; // Authentication middleware
import jwt from 'jsonwebtoken';  // Used to create JWT tokens
import { setAuthCookie } from '../utils/setAuthCookie'; // helper function to secure auth cookie

const router = express.Router(); // Create a new router for auth-related routes


router.post('/auth/login', (req, res, next) => { // POST Route handles username/passport login via Local Passport Strategy

    passport.authenticate('local', {session: false}, (err, user, info) => { // Invoke local strategy, disable sessions SINCE we're using JWT

        if (err) { // If server/database error, pass to Express error handler
            return next(err);
        }
        if (!user) { // If user login failed (via invalid password or user not found)
            return res.status(401).json({error: info.message});
        }

        const token = jwt.sign( //Otherwise, if login is successful, create JWT payload with userinfo (customizable)
            { id: user.id, username: user.username }, // JWT payload: what to encode (without sensitive info)
            process.env.JWT_SECRET,                   // JWT secret for signing (stored in .env)
            { expiresIn: '24h' }                      // Token expires in 24 hours
        );

        setAuthCookie(res, token); // Store token in secure, httpOnly cookie

        res.json({                                              // Send response back to client
                    message: 'Login successful',                // Optional message
                   user: {id: user.id, username: user.username} // Optionally return public-safe user data
        }); // send success response
    })
    (req, res, next); // Immedidately invoke the middleware

});


router.get('/auth/logout', (req, res) => { // Logout route: clears auth token from cookie
    res.clearCookie('token');              // remove JWT cookie from browser
    req.logout(() => {                     // Passport logout/cleanup hook (used with sessions, but safe to include)
        res.json({ message: 'Logged out successfully'}); // Respond with Logout confirmation
    });
});



router.get('/auth/google', // Google OAuth route: initiates login flow via Google and redirects to consent screen
    passport.authenticate('google', { scope: ['profile', 'email']}) // Ask Google for access to email + profile  
);




router.get('/auth/google/callback', // Google OAuth callback route that Google redirects to after user logs in
                     
    passport.authenticate('google', {session: false}), // Run Google strategy to extract user info and skip sessions
    (req, res) => {
        const user = req.user;                          // Passport attaches authenticated user to req.user

        const token = jwt.sign(                         // Create JWT for logged-in Google user
            { id: user.id, username: user.username },   // Payload with user info (safe fields only)
            process.env.JWT_SECRET,                     // Signin token with secret key
            { expiresIn: '24h' }                        // 24 hour expiration time
        );
        setAuthCookie(res, token);                      // Store token in httpOnly cookie for future requests
        res.redirect(process.env.CLIENT_HOME_URL || '/'); // Redirect to frontend after login 
                                                          // redirect customizable via .env
    }
);


export default router; // Export router to be mounted in server.js
