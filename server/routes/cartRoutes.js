import express from 'express';                      // imports express module to create router
import verifyJWT from '../middleware/verifyJWT.js'; // imports verifyJWT middleware to protect cart routes

import { 
         syncCartItems, 
         getCartItems 
        } from '../controller/cartController.js'; // imports cart controllers for syncing and retrieving cart items

const router = express.Router(); // creates a new express router

/* POST route syncs cart items from localStorage to database (route is protected via verifyJWT) */
router.post('/cart/sync', verifyJWT, syncCartItems); 

/* GET route retrieves current user's cart items (route is protected via verifyJWT) */
router.get('/cart', verifyJWT, getCartItems); 

export default router; // exports router for use in server.js
