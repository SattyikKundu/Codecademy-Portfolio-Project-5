import express from 'express';                      // imports express module to create router
import verifyJWT from '../middleware/verifyJWT.js'; // imports verifyJWT middleware to protect cart routes

import { 
         syncCartWithReduxState, 
         getCartItemsFromBackend 
        } from '../controller/cartController.js'; // imports cart controllers for syncing and retrieving cart items

const router = express.Router(); // creates a new express router

/* POST route syncs cart items from 'cart' store redux slice to database (route is protected via verifyJWT) */
router.post('/cart/sync', verifyJWT, syncCartWithReduxState); 

/* GET route retrieves current user's cart items and pushed them to visible frontend cart (route is protected via verifyJWT) */
router.get('/cart', verifyJWT, getCartItemsFromBackend); 

export default router; // exports router for use in server.js
