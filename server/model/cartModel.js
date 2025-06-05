import pool from '../database/database.js'; // imports database connection pool to execute queries

export const getCartItem = async (userId, productId) => { // gets existing cart item for specific user and product
 
  const query = `SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2`;  // query for cart item for given user and product

  const res = await pool.query(query, [userId, productId]); // executes query with userId and productId as parameters

  return res.rows[0]; // returns the first row if found, otherwise undefined
};


export const insertCartItem = async (userId, productId, quantity) => { // inserts new cart item for a user
  
  /* SQL query inserts new cart item row into 'cart_items' table */
  const query = `INSERT INTO cart_items (user_id, product_id, quantity) 
                  VALUES ($1, $2, $3)
                  RETURNING *`; // returns inserted row for verification

  const res = await pool.query(query, [userId, productId, quantity]); // executes query with given userId, productId, and quantity

  return res.rows[0]; // Return the inserted cart item row
};


export const updateCartItemQuantity = async (userId, productId, quantity) => { // updates quantity of an existing cart item

  /* SQL query updates quantity field of a cart item */
  const query = `UPDATE cart_items
                  SET quantity = $1
                  WHERE user_id = $2 AND product_id = $3
                  RETURNING *`; // returns updated row for verification

  const res = await pool.query(query, [quantity, userId, productId]); // executes query with the new quantity, userId, and productId

  return res.rows[0]; // returns updated cart item from row[0]
};


export const getProductStock = async (productId) => { // Gets stock quantity of a product

  const query = `SELECT stock FROM products WHERE id = $1`; // SQL query retrieves stock for specific product

  const res = await pool.query(query, [productId]); // Execute query using productId

  return res.rows[0]?.stock; // Return stock value (or undefined if product not found)
};

export const getCartItemsForUser = async (userId) => { // returns all cart items for a user (along with product details)

  /* Below SQL query joins 'cart_items' with 'products' for detailed cart info */
  const query = `
    SELECT 
      ci.product_id AS productId,       -- product ID in the cart
      ci.quantity,                      -- quantity of the product in cart
      p.display_name AS name,           -- product name
      p.price AS unitPrice,             -- unit price of product
      p.image_url AS imageFilePath,     -- image URL of the product
      p.stock AS quantityLimit          -- maximum quantity allowed (stock-based)
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = $1               -- filter for specific user
  `;

  const res = await pool.query(query, [userId]); // Execute query using userId

  return res.rows; // Return the list of cart items
};
