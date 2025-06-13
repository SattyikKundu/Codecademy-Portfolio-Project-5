
import pool from "../database/database.js"; // import database connection pool to execute queries


export const insertOrder = async (userId, deliveryData, costData) => { // insert new order into 'orders' table
  const {
    firstName, lastName, 
    email, phoneNumber,
    addressLine1, addressLine2, 
    city, state, postalCode
  } = deliveryData; // Destructure delivery address data

  const {
    subTotal, shippingCost, 
    taxAmount, total
  } = costData; // Destructure cost values for the order

  const query =  `INSERT INTO orders (
      user_id, 
      first_name, 
      last_name, 
      email, 
      phone_number,
      address_line1, 
      address_line2, 
      city, 
      state, 
      postal_code,
      sub_total, 
      shipping_cost, 
      tax_amount, 
      total
    ) VALUES (
     $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`;


  // Insert new row into orders table and return inserted row's ID
  const result = await db.query(query,
    [userId, firstName, lastName, email, phoneNumber,
    addressLine1, addressLine2, city, state, postalCode,
    subTotal, shippingCost, taxAmount, total]
  );

  return result.rows[0].id; // Return the newly created order ID (use for insertOrderItems() below)
};



export const insertOrderItems = async (orderId, items) => { // insert order items into 'order_item' tables

  const query = `INSERT INTO order_items (order_id, product_id, quantity, price_each)`;
  
  const queries = items.map (item => { // parse items and insert into order_items
    return pool.query (
        query, [orderId, item.productId, item.quantity, item.unitPrice]
    );
  });

  await Promise.all(queries); // Promise to execute all insert queries in parallel
};


export const clearUserCart = async (userId) => { // empty user cart AFTER successful checkout

  const query = `DELETE FROM cart_items WHERE user_id=$1`;
  await pool.query(query, [userId]);
};
