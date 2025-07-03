import express from "express";                                        // Express router for routing
import verifyJWT from '../middleware/verifyJWT.js';                   // Import middleware to protect route
import { fetchUserOrders, getOrderDetails } from "../controller/ordersController.js";  // Import controller logic

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order history and details (👤 MUST to be registered and logged-in to test ALL order history and details routes)
 */


/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Gets order history for authenticated user 
 *     tags: [Orders]
 *     details: | 
 *              Returns list of past orders by logged-in user where each list item (or past order) presents 
 *              basic information about each order (including order ID, order date, and total cost).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       order_id:
 *                         type: integer
 *                       placed_at:
 *                         type: string
 *                         format: date-time
 *                       total:
 *                         type: number
 *                         format: float
 *                       sub_total:
 *                         type: number
 *                         format: float
 *                       tax_amount:
 *                         type: number
 *                         format: float
 *                       shipping_cost:
 *                         type: number
 *                         format: float
 *                       item_count:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 */
/* GET route where only authenticated users can access their order history */
router.get("/orders", verifyJWT, fetchUserOrders);



/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get detailed view of a specific order
 *     tags: [Orders]
 *     description:  Gets detailed view of a specific order from logged-in user's order history.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderDetails:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: integer
 *                     placed_at:
 *                       type: string
 *                       format: date-time
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     address_line1:
 *                       type: string
 *                     address_line2:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     postal_code:
 *                       type: string
 *                     sub_total:
 *                       type: number
 *                     tax_amount:
 *                       type: number
 *                     shipping_cost:
 *                       type: number
 *                     total:
 *                       type: number
 *                     quantity_total:
 *                       type: integer
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_name:
 *                             type: string
 *                           image_url:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                           unit_price:
 *                             type: number
 *                           total:
 *                             type: number
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized – JWT missing or invalid
 *       500:
 *         description: Server error fetching order details
 */
/* GET route where authenticated users can access details to a specific order (via 'orderId') in their order history */
router.get("/orders/:orderId", verifyJWT, getOrderDetails); 

export default router;
