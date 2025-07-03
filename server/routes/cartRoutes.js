import express from 'express';                      // imports express module to create router
import verifyJWT from '../middleware/verifyJWT.js'; // imports verifyJWT middleware to protect cart routes

import { 
         syncCartWithReduxState, 
         getCartItemsFromBackend,
         addItemToCart,
         increaseCartItem,
         decreaseCartItem,
         removeCartItem 
        } from '../controller/cartController.js'; // imports cart controllers for syncing and retrieving cart items

const router = express.Router(); // creates a new express router

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart actions (👤 MUST to be registered and logged-in to test ALL cart routes)
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all items in the logged-in user's cart 
 *     tags: [Cart]
 *     description: Returns JSON object containing all items currently in logged-in user's cart.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cartState:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           unitPrice:
 *                             type: number
 *                           totalPrice:
 *                             type: number
 *                           quantityLimit:
 *                             type: integer
 */
/* GET route retrieves user's cart items for frontend display (protected by verifyJWT) */
router.get('/cart', verifyJWT, getCartItemsFromBackend); 

/**
 * @swagger
 * /cart/{productId}/add:
 *   post:
 *     summary: Add a product to the cart (or increase by 1 if already exists)
 *     tags: [Cart]
 *     description:  Adds a product to the cart (or increase product quantity by 1 if it already exists in cart).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item added successfully
 *       400:
 *         description: Product is out of stock
 *       500:
 *         description: Server error while adding item
 */
/* POST route to add item to backendcart */
router.post('/cart/:productId/add', verifyJWT, addItemToCart);


/**
 * @swagger
 * /cart/{productId}/increase:
 *   patch:
 *     summary: Increase quantity of a cart item by 1
 *     tags: [Cart]
 *     description: Increase quantity of a cart item by 1. Increase can be done until quantity limit is reached (which is 10 or less if stock under 10).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quantity increased
 *       400:
 *         description: Product is out of stock
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 */
/* PATCH route to increase quantity of a cart item */
router.patch('/cart/:productId/increase', verifyJWT, increaseCartItem);

/**
 * @swagger
 * /cart/{productId}/decrease:
 *   patch:
 *     summary: Decrease quantity of a cart item by 1
 *     tags: [Cart]
 *     description: Decrease quantity of a cart item by 1. This can be done until a cart item's quantity hits 1 as ENFORCED in frontend logic. Aftwards, user has to delete item(/cart/:productId) to completely remove cart item.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quantity decreased or item removed
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Server error
 */
/* PATCH route to decrease quantity of a cart item */
router.patch('/cart/:productId/decrease', verifyJWT, decreaseCartItem);


/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove a product from the cart completely
 *     tags: [Cart]
 *     description: Deletes a product from cart completely. Need to insert product Id of existing cart item to successfuly delete
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart item removed
 *       500:
 *         description: Failed to remove cart item
 */
/* DELETE route removes a cart item completely */
router.delete('/cart/:productId', verifyJWT, removeCartItem);


/**
 * @swagger
 * /cart/sync:
 *   post:
 *     summary: Syncs redux 'cart' state (from localStorage) to backend database after login
 *     tags: [Cart]
 *     description: |
 *                  Prior to logging in, user can perform cart actions during 'guest' mode where the cart items are stored 
 *                  in browser's localStorage. Once user logs in, the user's backend cart in database gets "synced" with 
 *                  the cart items from localStorage cart (basically, items are now moved and added to the backend cart in user's account).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Array of cart items (can be empty if no items in guest cart)
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required: [productId, quantity]
 *               properties:
 *                 productId:
 *                   type: integer
 *                   example: 1
 *                 quantity:
 *                   type: integer
 *                   example: 2
 *     responses:
 *       200:
 *         description: Cart synced successfully
 *       400:
 *         description: Invalid cart data
 *       500:
 *         description: Server error during sync
 */
/* POST route syncs cart items from 'cart' store redux slice to database (route is protected via verifyJWT) */
router.post('/cart/sync', verifyJWT, syncCartWithReduxState); 



export default router; // exports router for use in server.js
