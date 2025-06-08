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

/* GET route retrieves user's cart items for frontend display (protected by verifyJWT) */
router.get('/cart', verifyJWT, getCartItemsFromBackend); 

/* POST route to add item to backendcart */
router.post('/cart/:productId/add', verifyJWT, addItemToCart);

/* PATCH route to increase quantity of a cart item */
router.patch('/cart/:productId/increase', verifyJWT, increaseCartItem);

/* PATCH route to decrease quantity of a cart item */
router.patch('/cart/:productId/decrease', verifyJWT, decreaseCartItem);

/* DELETE route removes a cart item completely */
router.delete('/cart/:productId', verifyJWT, removeCartItem);

/* POST route syncs cart items from 'cart' store redux slice to database (route is protected via verifyJWT) */
router.post('/cart/sync', verifyJWT, syncCartWithReduxState); 



export default router; // exports router for use in server.js
