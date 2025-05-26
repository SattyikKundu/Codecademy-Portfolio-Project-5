import express from 'express';   // Imported framework for defining routes
import passport from 'passport'; // Authentication middleware

import { loginUser,             // local login controller
         logoutUser,            // logout controller
         registerUser,   // local registration controller
         handleGoogleCallback   // Google OAuth callback controller
       } from '../controller/authController.js';

const router = express.Router();

router.post('/auth/register', registerUser); // local registration route: registers new user (username, email, password)

router.post('/auth/login', loginUser);    // POST Route handles username/passport login via Local Passport Strategy
router.get('/auth/logout', logoutUser);   // Logout route: clears auth token from cookie

router.get('/auth/google',  // Google OAuth route: initiates login flow via Google and redirects to consent screen
  passport.authenticate('google', { scope: ['profile', 'email'] })    // Asks Google for access to email + profile  
);

router.get('/auth/google/callback',  // Google OAuth callback route that Google redirects to after user logs in
  passport.authenticate('google', { session: false }),  // Run Google strategy to extract user info and skip sessions
  handleGoogleCallback                                  // Then call our controller function
);

export default router;