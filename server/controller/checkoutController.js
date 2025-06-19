
import Stripe from 'stripe';  // Import Stripe SDK

//import pool from '../database/database.js'; // use for 'rollback' transaction

import {
        insertOrder,
        insertOrderItems,
        clearUserCart,
        updateUserProfileAddress,
        validateAndAdjustCart,
        updateBackendCart,
        removeOutOfStockItemsFromCart,
        deductProductStock 
       } from '../model/checkoutModel.js'; // import functions from checkoutModel.js


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Create Stripe instance using secret key


/***************************************************************************************************/
/***************************************************************************************************/
/** Main Controller function for handling checkout when user clicks 'Pay' button in Checkout Page **/
/***************************************************************************************************/
/***************************************************************************************************/

export const handleCheckout = async (req, res) => { // Controller to handle checkout process

  const userId = req.user.id;                         // Get authenticated user ID from JWT payload

  const {
    cartItems,              // Expect cart items array from frontend
    deliveryInfo,           // Contains delivery form fields
    saveAddressToProfile,   // Boolean for saving delivery info to user profile
    cartTotals              // Contains subtotal, tax, shipping, total
  } = req.body;             // destructure inputs from req.body


  const { adjustedCart, 
          conflictItems } = await validateAndAdjustCart(userId, cartItems); //get adjusted cart for frontend 
                                                                            // and conflict items for backend

  if (conflictItems.length > 0) { // If conflict items found, adjust backend cart to match 'adjustedCart'

    await updateBackendCart(userId, adjustedCart); // update backend cart with new adjusted cart
    await removeOutOfStockItemsFromCart(userId, conflictItems); // remove out of stock items

    return res.status(400).json({ // If conflict, return error message and adjusted cart to checkout
                                  // so user can see prior to attempting another checkout.
      error: 'Some items in your cart were adjusted or removed due to stock limitations.',
      conflictItems,
      updatedCart: adjustedCart
    });
  }


  try {
     // 1. Validate ZIP code format server-side (basic regex)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(deliveryInfo.postalCode)) { 
      return res.status(400).json({ error: 'Invalid ZIP code format.' });
    }

    /* NOTE: will revisit handling transaction and roll back on a later time.
     *  would also have to refactor several functions in checkoutModel.js for compatibility.
     */
    //const client = await pool.connect(); // Get access to DB client for transaction recording
    //await client.query('BEGIN'); // Begin transaction

    // 2. Create a Stripe PaymentIntent for the total amount 
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(cartTotals.total * 100),  // Stripe expects amount in cents
      currency: 'usd',                               // USD currency
      metadata: { integration_check: 'accept_a_payment' },
    });

    // 3. Insert order into orders table (get orderId for next function) 
    const orderId = await insertOrder(userId, deliveryInfo, cartTotals);

    // 4. Insert all order_items 
    await insertOrderItems(orderId, cartItems);

    // 5. Deduct product stock from inventory
    await deductProductStock(adjustedCart);

    // 6. Optionally update user profile if requested
    if (saveAddressToProfile) {
      await updateUserProfileAddress(userId, deliveryInfo);
    }

    // 7. Clear the user's cart AFTER processing order
    await clearUserCart(userId);

    //await client.query('COMMIT'); // Success: commit transaction

    // 8. Return client secret for frontend to confirm payment AND orderId for success page
    res.status(200).json({ message: 'Checkout successful.', clientSecret: paymentIntent.client_secret, orderId: orderId });
  } 
  catch (error) {
    //await client.query('ROLLBACK'); // On error, rollback everything

    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Something went wrong during checkout.' });
  }
  finally {
    client.release(); // Always release connection at end of transaction
  }
};

