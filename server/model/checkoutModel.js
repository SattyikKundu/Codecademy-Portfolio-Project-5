
import pool from "../database/database.js"; // import database connection pool to execute queries

import {getCartItem, 
        updateCartItem, 
        addCartItem, 
        deleteCartItem} from './cartModel.js'; // needed for adjusting cart AFTER validating user cart against
                                               // products' stock

/***************************************************************************************************/
/**** #1: Handles inserting new order into the 'orders' table when user submits durign checkout. ***/
/***************************************************************************************************/

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

/***************************************************************************************************/
/*** #2: Inserts order's items and their quantity in 'order_items' table — referenced by orderId ***/
/***************************************************************************************************/

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


/***************************************************************************************************/
/************ #2: Allows user to update user profile's info during checkout (optional) *************/
/***************************************************************************************************/

export const updateUserProfileAddress = async (userId, delivery) => { 

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

/***************************************************************************************************/
/************ #3: Empties user's cart AFTER successful checkout ************************************/
/***************************************************************************************************/

export const clearUserCart = async (userId) => { // empty user cart AFTER successful checkout
  const query = `DELETE FROM cart_items WHERE user_id=$1`;
  await pool.query(query, [userId]);
};

/***************************************************************************************************/
/******** #4: Updates cart if changes are needed (i.e. missing stock, reduced stock, etc.) *********/
/***************************************************************************************************/

export const validateAndAdjustCart = async (userId, cartItems) => { // validates cart items and adjusts as needed
                                                            // 'userId' added in case of future use/modifications

  const adjustedCart  = []; // stores final adjusted cart
  const conflictItems = []; // tracks conflicted items (difference between cart quantity and current stock)

  for (const item of cartItems) { // for each item, get it's current stock 

    const query = `SELECT stock FROM products WHERE id=$1`; // SQL query to get product's stock
    const result = await pool.query(query, [item.productId]);
    const stock = result.rows[0]?.stock || 0;

    if (stock === 0) { // if item out of stock, remove from cart (save 'action' identifier for later functions)
      conflictItems.push({ productId: item.productId, action: 'remove' });
    } 
    else if (item.quantity > stock) { // if cart quantity exceeds stock, adjust current cart
      conflictItems.push({ productId: item.productId, action: 'adjust', newQuantity: stock });
      adjustedCart.push({ 
        ...item, 
        quantity: stock, 
        quantityLimit: stock,
        totalPrice: (parseFloat(item.unitPrice) * stock).toFixed(2) // (fallback) update totalPrice via quantity change
       });
    } 
    else { // otherwise if no conflict, add same item and quantity as normal
      adjustedCart.push(item);
    }
  }

  return { adjustedCart, conflictItems }; // return adjusted cart and conflict items
};


/***************************************************************************************************/
/******** #5: After cart validation (in above/pre function), update backend cart *******************/
/***************************************************************************************************/

export const updateBackendCart = async (userId, adjustedCart) => {

  for (const item of adjustedCart) { // iterate each item in backend cart

    const { productId, quantity } = item; // get adjusted item's id and quantity
    const existing = await getCartItem(userId, productId); // get cart item IF it exists

    if (existing) { // if item exists in cart, adjust quantity
      await updateCartItem(userId, productId, quantity);
    } 
    else { // other, if item missing, add to cart
      await addCartItem(userId, productId, quantity);
    }
  }
};

/***************************************************************************************************/
/******** #6: After cart validation (in above/pre function), update backend cart *******************/
/***************************************************************************************************/

export const removeOutOfStockItemsFromCart = async (userId, conflictItems) => {
  for (const item of conflictItems) {
    if (item.action === 'remove') { // if item has 'remove' flag, remove item
      await deleteCartItem(userId, item.productId);
    }
  }
};

/***************************************************************************************************/
/**** #7: Upon valid order, deduct stock from inventory, used after validateAndAdjustCart() ********/
/***************************************************************************************************/

export const deductProductStock = async (cartItems) => {
  const query = `
    UPDATE products
    SET stock = stock - $1
    WHERE id = $2 AND stock >= $1`; // query to delete cart item quanitity from stock

  for (const item of cartItems) { // iterate through cart items to deduct item's quanitity from stock
    await pool.query(query, [item.quantity, item.productId]);
  }
};


