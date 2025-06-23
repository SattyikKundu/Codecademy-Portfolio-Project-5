import express from "express";                                        // Express router for routing
import verifyJWT from '../middleware/verifyJWT.js';                   // Import middleware to protect route
import { fetchUserOrders, getOrderDetails } from "../controller/ordersController.js";  // Import controller logic

const router = express.Router();

/* GET route where only authenticated users can access their order history */
router.get("/orders", verifyJWT, fetchUserOrders);

/* GET route where authenticated users can access details to a specific order (via 'orderId') in their order history */
router.get("/orders/:orderId", verifyJWT, getOrderDetails); 

export default router;
