
import Stripe from 'stripe';  // Import Stripe SDK
import {
        insertOrder,
        insertOrderItems,
        clearUserCart,
        updateUserProfileAddress 
       } from '../model/checkoutModel.js'; // import functions from checkoutModel.js


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Create Stripe instance using secret key


export const handleCheckout = async (req, res) => { // Controller to handle checkout process

  const userId = req.user.id;                         // Get authenticated user ID from JWT payload

  const {
    cartItems,              // Expect cart items array from frontend
    deliveryInfo,           // Contains delivery form fields
    saveAddressToProfile,   // Boolean for saving delivery info to user profile
    cartTotals              // Contains subtotal, tax, shipping, total
  } = req.body;             // destructure inputs from req.body


  try {
     // 1. Validate ZIP code format server-side (basic regex)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(deliveryInfo.postalCode)) { 
      return res.status(400).json({ error: 'Invalid ZIP code format.' });
    }

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

    // 5. Optionally update user profile if requested
    if (saveAddressToProfile) {
      await updateUserProfileAddress(userId, deliveryInfo);
    }

    // 6. Clear the user's cart AFTER processing order
    await clearUserCart(userId);

    // 7. Return client secret for frontend to confirm payment AND orderId for success page
    res.status(200).json({ message: 'Checkout successful.', clientSecret: paymentIntent.client_secret, orderId: orderId });
  } 
  catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Something went wrong during checkout.' });
  }
};
