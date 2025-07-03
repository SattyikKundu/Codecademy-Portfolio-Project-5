import productController from '../controller/productController.js';
import express from 'express';

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products retrieval and filtering routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         display_name:
 *           type: string
 *         description:
 *           type: string
 *         image_url:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         category:
 *           type: string
 */


const router = express.Router(); // define router to group all routes related to interacting with products data

/* Below route(s) gets all products. In App.jsx, <Navigate> is used
 *  to redirect other url routes like '/' and '/products to below route.
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Failed to retrieve products
 */
router.get('/', productController.getProducts); 
router.get('/products', productController.getProducts); 
router.get('/products/all', productController.getProducts);  


/**
 * @swagger
 * /products/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: 'Product category (Options(without quotes): "all", "fishes", "invertebrates", "corals & anemeones").'
 *     responses:
 *       200:
 *         description: Filtered list of products by category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found for this category
 *       500:
 *         description: Failed to retrieve products for category
 */
router.get('/products/:category', productController.getProductsByCategory); // Route to get products by category



/**
 * @swagger
 * /products/all/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to retrieve product
 */
router.get('/products/all/:id', productController.getProductById);  // Routes to get product by id 
router.get('/products/:category/:id', productController.getProductById); 


export default router; // export this router for server.js

