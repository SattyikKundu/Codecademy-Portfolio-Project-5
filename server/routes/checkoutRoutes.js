
import express from 'express';                                         // Express router for routing
import { handleCheckout } from '../controller/checkoutController.js';  // Import controller logic
import verifyJWT from '../middleware/verifyJWT.js';             // Import middleware to protect route

const router = express.Router(); // Create router instance

/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Payment processing (🔒 NOT testable via Swagger UI)
 */

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Processes checkout and creates Stripe payment intent (🔒 NOT testable via Swagger UI)
 *     description: >
 *       This route requires authentication and cannot be tested directly in Swagger UI due to
 *       required user/cart data and Stripe integration. Features include validating cart stock, optional update to user profile, 
 *       inserting order into database, deducting product stock, and clearing the cart on purchase. 
 *       If conflicts exist (e.g., stock changed), the cart is adjusted/updated and an error is returned.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Required checkout data from frontend (user/cart/payment)
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItems:
 *                 type: array
 *                 description: Current cart contents
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     unitPrice:
 *                       type: number
 *               deliveryInfo:
 *                 type: object
 *                 description: Shipping and billing info entered by user
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   addressLine1:
 *                     type: string
 *                   addressLine2:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *               saveAddressToProfile:
 *                 type: boolean
 *                 description: Whether to update the user profile with this delivery address
 *               cartTotals:
 *                 type: object
 *                 properties:
 *                   subTotal:
 *                     type: number
 *                   shippingCost:
 *                     type: number
 *                   taxAmount:
 *                     type: number
 *                   total:
 *                     type: number
 *     responses:
 *       200:
 *         description: Checkout successful – returns Stripe client secret and order ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Checkout successful.
 *                 clientSecret:
 *                   type: string
 *                   example: some_stripe_client_secret
 *                 orderId:
 *                   type: integer
 *       400:
 *         description: Conflict or validation error (e.g. stock mismatch, invalid ZIP)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conflict:
 *                   type: boolean
 *                 error:
 *                   type: string
 *                 conflictItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                 updatedCart:
 *                   type: array
 *       500:
 *         description: Server error – failed during checkout process
 */

/* POST route where only authenticated users can access checkout page */
router.post('/checkout', verifyJWT, handleCheckout); 

export default router; // Export for use in main server router
