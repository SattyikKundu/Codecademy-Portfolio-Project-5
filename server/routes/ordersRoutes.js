import express from "express";                                        // Express router for routing
import verifyJWT from '../middleware/verifyJWT.js';                   // Import middleware to protect route
import { fetchUserOrders } from "../controller/ordersController.js";  // Import controller logic

const router = express.Router();

/* GET route where only authenticated users can access their order history */
router.get("/orders", verifyJWT, fetchUserOrders);

export default router;
