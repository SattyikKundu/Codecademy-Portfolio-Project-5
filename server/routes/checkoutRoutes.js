import express from 'express';  // Express router for routing
import { handleCheckout } from '../controller/checkoutController.js';  // Import controller logic
import verifyJWT from '../middleware/verifyJWT.js'; // Import middleware to protect route

const router = express.Router(); // Create router instance

/* POST route where only authenticated users can access checkout page */
router.post('/checkout', verifyJWT, handleCheckout); 

export default router; // Export for use in main server router
