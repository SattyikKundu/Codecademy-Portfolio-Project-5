
import passport from 'passport';                            // import Passport core module for handling auth middleware
import { Strategy as LocalStrategy } from 'passport-local'; // Strategy for username/password login
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'; // Strategy for Google OAuth login 
import bcrypt from 'bcryptjs';                              // for securly comparing hashed passwords
import pool from '../database/database.js';                    // import PostgreSQL database connection pool

/* NOTE: The done() callback in Passport strategies signals result of an
 *       authentication attempt. It's signature typically: 
 *       done(error, user, info)
 * 
 *   Parameter	    Typical Value	      Meaning
 *     error	    null or Error	      If error, pass error object here. Otherwise, pass null.
 *     user	        user or false	      If authentication succeeded, pass authenticated user object. Otherwise, pass false if failure.
 *     info	         { message: ... }	  Optional info object about authentication results. Commonly used to give a message why authentication failed 
 * 
 *  Examples:
 *  #1.) Successful authentication: done (null,user)
 *  #2.) Failure (no user found):   done (null, false)
 *  #3.) Failure w/message:         done (null, false, {message: 'Incorrect password.'}) 
 *  #4.) Error:                     done (error)
*/

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]); // find user
        /* NOTE: The 'username' should already be unique since it's 
         *       enforced in PostgreSQL database via UNIQUE keyword.
         */
        const user = res.rows[0]; // extract user from result
        
        if (!user) { // If no user found
            return done(null, false, {message: 'Incorrect username.'});
        } 

        const isMatch = await bcrypt.compare(password, user.password_hash); // compare entered password with hashed password

        if (!isMatch) { // password doesn't match
            return done(null, false, {message: 'Incorrect password.'});
        }

        return done (null, user); // When both matches are successful, pass user to req.user
    }
    catch(error) {
        return done(error); // Handle database/logic error
    }
}));


passport.use(
  new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,     // Google OAuth Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google OAuth Secret
    //callbackURL:  '/auth/google/callback'           // Redirect URI/Route that handles OAuth response after Google authenticates the user
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
  }, 
  async(accessToken, refreshToken, profile, done) => {
    try {
        const res = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]); // Check if user already exists
                                                                                // same as findUserByGoogleId() from authModel.js
        if (res.rows.length > 0) { // user exists on login, pass it to Passport
            return done(null, res.rows[0]); 
        }

        // Otherwise, register new user into DB (this is same as createUser() from authModel.js)
        const newUser = await pool.query(
            "INSERT INTO users (username, email, google_id) VALUES ($1, $2, $3) RETURNING *",
           [profile.displayName.replace(/\s+/g, ''), // use display name (no spaces) as username
            profile.emails[0].value,                 // email from Google progile
            profile.id]                              // Google ID from profile
        );
        return done(null, newUser.rows[0]); // Pass new user object ("Login") to Passport
    }
    catch(error) {  // Handle database errors
        return done(error); 
    }
  }
));


/* Session Serialization:
 * Controls what user info is stored in the session after login
 * This is called ONCE after a successful login. The data you pass here is stored in the session store.
 * Most apps just store the user ID to keep the session data minimal and secure.
 */
passport.serializeUser((user, done) => 
    // (user object after successful login) user === the whole user object (e.g., { id, username, email, ... })
    done(null, user.id) // Only store user ID in session store (not full object) for security and performance
); 

/* Session Deserialization: 
 * Runs on every request where a session is active.
 * Uses the stored ID to retrieve the full user object from the database.
 * That full user object is attached to 'req.user' and becomes accessible in route handlers.
 * This is how Passport keeps track of the authenticated user across multiple requests,
 * especially during access to protected routes!
 */
passport.deserializeUser(async (id, done) => {
    try {
        const res = await pool.query('SELECT * FROM users WHERE id=$1', [id]); // Fetch full user by ID stored in session
        done(null, res.rows[0]);              // Attach user object to req.user so it can be accessed in protected routes
        // req.user is used by the system to identify current logged-in user
        // Hence, it's ESSENTIAL for controlling access to protected routes and user-specific actions
    }
    catch(error) { // If error occurs, gracefully pass it to passport for handling
        done(error, null);
    }
});