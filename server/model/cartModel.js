
import pool from "../database/database"; // import database connection pool to execute queries


export const getCartItem = async (userId, productId) => { // gets item details from user's cart

  const query = `SELECT * FROM cart_items WHERE 
                 user_id=$1 AND product_id=$2`; // query for cart item using product and user ids

  const response = await pool.query(query, [userId, productId]);
  return response.rows[0]; // return result from 1st row IF defined, otherwise return undefined
}

export const addCartItem = async (userId, productId, quantity) => { // adds item to cart (quantity checking done in cartController.js)

  const query = `INSERT INTO cart_items (user_id, product_id, quantity) 
                 VALUES ($1, $2, $3) RETURNING *`; // "RETURNING *" returns inserted row for verification

  const response = await pool.query(query, [userId, productId, quantity]);
  return response.rows[0]; // returns inserted row
}

export const updateCartItem = async (userId, productId, quantity) => { // update cart item's quantity

  const query = `UPDATE cart_items
                 SET quantity=$3
                 WHERE user_id=$1
                 AND product_id=$2
                 RETURNING *`; // updates cart item quanity and returns updated row


  const response = await pool.query(query, [userId, productId, quantity]);
  return response.rows[0]; // returns resulting updated row
}

export const deleteCartItem = async (userId, productId) => { // delete single cart item for user

  const query = `DELETE FROM cart_items 
                 WHERE user_id=$1 AND product_id=$2
                 RETURNING *`; // deletes 1 row due to WHERE condition(s).

  const response = await pool.query(query, [userId, productId]);
  return response.rows[0]; // returns deleted row
}

export const deleteCart = async (userId) => { // delete user's entire cart (delete all cart_item)
                                              // (not needed currently, but can be useful later)

  const query = `DELETE FROM cart_items 
                 WHERE user_id=$1`; // deletes all cart item rows due under user.

  await pool.query(query, [userId]); // no return needed here
}

export const getProductStock = async (productId) => { // check stock of product 
                                                      // (used to validate user's cart quantity limit)

  const query = `SELECT stock FROM products WHERE id=$1`; // return products stock

  const response = await pool.query(query, [productId]);
  return response.rows[0]; //returns stock amount for product
}

export const getCartItemsForUser = async (userId) => { // returns all current cart items for user

  // returns full user's cart
  const query = `SELECT
    products.id                                                   AS "productId",
    products.image_url                                            AS "imageFileName",
    products.display_name                                         AS "name",
    cart_items.quantity                                           AS "quantity",
    products.price                         												AS "unitPrice",
    CAST((cart_items.quantity * products.price) AS NUMERIC(10,2)) AS "totalPrice",
    LEAST(products.stock, 10)                                     AS "quantityLimit"
    FROM cart_items INNER JOIN products
    ON cart_items.product_id = products.id
    WHERE cart_items.user_id=$1;`; // query returns all user's cart items with data MATCHING 
                                  // the cart items' data format found in frontend cart's redux slice.

  const response = await pool.query(query, [userId]);
  return response.rows; // returns all current cart items for user (as an array with all rows)
} 