
import pool from "../database/database.js"; // import database connection pool to execute queries


export const insertOrder = async (userId, deliveryData, costData) => { // insert new order into 'orders' table

  const values = [ // contains all input data as 1 'values' array without destructuring
    userId,
    deliveryData.firstName, 
    deliveryData.lastName, 
    deliveryData.email, 
    deliveryData.phoneNumber,
    deliveryData.addressLine1, 
    deliveryData.addressLine2 || null, // this field is optional 
    deliveryData.city, 
    deliveryData.state, 
    deliveryData.postalCode,
    costData.subTotal, 
    costData.shippingCost, 
    costData.taxAmount, 
    costData.total
  ];

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

  const result = await pool.query(query, values); // Insert new row into 'orders' table 
                                                  // and return inserted row's ID

  return result.rows[0].id; // Return the newly created order ID (use for insertOrderItems() below)
};


export const insertOrderItems = async (orderId, cartItems) => { // insert order items into 'order_item' tables

  const query = `INSERT INTO order_items (order_id, product_id, quantity, price_each)
                 VALUES ($1, $2, $3, $4);`;
  
  for (const item of cartItems) {
    await pool.query(query, [
      orderId, 
      item.productId, 
      item.quantity, 
      item.unitPrice // matches the label used in frontend. Also, due to ordering,
                     // item.unitPrice matches price_each in query
    ]);
  }
};

export const updateUserProfileAddress = async (userId, delivery) => { // optionally update user info (address, phone, email, etc.)

  //console.log(`Inside updating user profile [id: ${userId}] for: `, delivery);

  const query = `UPDATE users SET 
      email = $1,
      first_name = $2,
      last_name = $3,
      phone_number = $4,
      address_line1 = $5,
      address_line2 = $6,
      city = $7,
      state = $8,
      postal_code = $9
      WHERE id = $10`; // 'AND email != $1' only works if DIFFERNT email (too strict)!

  await pool.query(query, [
    delivery.email,
    delivery.firstName,
    delivery.lastName,
    delivery.phoneNumber,
    delivery.addressLine1,
    delivery.addressLine2 || null,
    delivery.city,
    delivery.state,
    delivery.postalCode,
    userId
  ]); 

};


export const clearUserCart = async (userId) => { // empty user cart AFTER successful checkout

  const query = `DELETE FROM cart_items WHERE user_id=$1`;
  await pool.query(query, [userId]);
};
