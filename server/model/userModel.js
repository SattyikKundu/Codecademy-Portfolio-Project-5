import pool from "../database/database";

/* uses userId to return user profile data (as an object, not a promise) */
export const getUserProfileById = async (userId) => {

    const query = // query for returning user data
        `SELECT 
            id, 
            first_name, 
            last_name, 
            username, 
            email, 
            phone_number, 
            created_at,
            address_line1, 
            address_line2, 
            city, 
            state, 
            postal_code
            FROM users
            WHERE id = $1;
        `;
    
    const response = await pool.query(query, [userId]); // 'userId' substitutes $1 in query before 
                                                        // execution and returns profile data object

    return response.rows[0]; // returns user profile data, which IS THE FIRST row
}



/* Update user profile (via userId) using 'updatedFields' object (which contains updated field values) */
export const updateUserProfile = async (userId, updatedFields) => { 

    const { // destructured 'updatedFields' object that contains all updated values
        first_name,
        last_name,
        email,
        phone_number,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
    } = updatedFields;


    // query string for udpating the user pofile upon submitting profile data changes
    const query = ` 
    UPDATE users
    SET 
      first_name = $1,
      last_name = $2,
      email = $3,
      phone_number = $4,
      address_line1 = $5,
      address_line2 = $6,
      city = $7,
      state = $8,
      postal_code = $9
    WHERE id = $10
    RETURNING 
      id, 
      first_name, 
      last_name, 
      username, 
      email, 
      phone_number, 
      created_at,
      address_line1, 
      address_line2, 
      city, 
      state, 
      postal_code;
  `;

    const values = [ // stores desctructured values in a 'values' array
    first_name,
    last_name,
    email,
    phone_number,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    userId
  ];

  const response = await pool.query(query, values); // executes query and inserts 'values' array 
                                               // as input for query's placeholders($)
                                               
  return response.rows[0]; // returns the first row of the updated user profile data
}
