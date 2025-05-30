import express from 'express';   // Imported framework for defining routes
import passport from 'passport'; // Authentication middleware
import verifyJWT from '../middleware/verifyJWT.js'; // Import verifyJWT auth middleware

import { loginUser,             // local login controller
         logoutUser,            // logout controller
         registerUser,          // local registration controller
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


// This 'route' is utilized AFTER login to verify if user is logged in via JWT cookie and return user info
router.get('/auth/me',            // Define GET route at '/auth/me'
  verifyJWT,                      /* Apply JWT middleware(verifyJWT()) to protect this route.
                                   * However, if token is invalid, the next() inside verifyJWT() 
                                   * won't be called. This prevents Express from proceeding to the callback function.
                                   */
  (req, res) => {                 
                                  // Callback function runs if token is valid
                                  // At this point, verifyJWT has decoded the JWT and attached user data to req.user
    res.json({ user: req.user }); // Send the user info back to the frontend as JSON
  }
);




export default router;