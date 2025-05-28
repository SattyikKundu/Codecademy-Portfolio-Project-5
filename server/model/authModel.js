// File handles database access for authentications routes

import pool from '../database/database.js'; // Connects to PostgreSQL

export const findUserByUsername = async (username) => { // Find user by username (for local login)

  try {
      const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      return res.rows[0]; // Returns 1st value from 'rows'. There SHOULD only be 1
                          // matching 'username' since 'username' is enforced as UNIQUE in database.
  }
  catch(error) { // return error message
    console.log(`Unable to find user '${username}': `,error);
  }

};

export const findUserByGoogleId = async (googleId) => { // Find user by Google ID (logic ALREADY in passportConfig.js)

  try {
    const res = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    return res.rows[0]; // Returns 1st value from 'rows'. There SHOULD only be 1
                        // matching 'google_id' since 'google_id' is enforced as UNIQUE in database.
  }
  catch (error) {
    console.log(`Unable to find user for GoogleId '${googleId}': `, error);
  }                  
};


export const findUserByEmail = async (email) => { // Find user by email (optional helper)
  try {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return res.rows[0]; // Returns 1st value from 'rows'. There SHOULD only be 1
                          // matching 'email' since 'email' is enforced as UNIQUE in database.
  }
  catch(error) {
        console.log(`Unable to find user for Email '${email}': `, error);
  }
};

// Finally, create new user locally or via Google (logic already mostly used in Google OAuth passportConfig.js)
// NOTE: depending on login/register method, passwordHash OR googleId can have default null value
export const createUser = async ({ username, email, passwordHash = null, googleId = null }) => { 
  const res = await pool.query(
    `INSERT INTO users (username, email, password_hash, google_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [username, email, passwordHash, googleId]
  );
  return res.rows[0]; // return created response for executed query
};
