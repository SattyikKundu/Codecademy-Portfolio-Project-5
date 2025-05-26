import productController from '../controller/productController.js';
import express from 'express';

const router = express.Router(); // define router to group all routes related to interacting with products data

/* Below route(s) gets all products. In App.jsx, <Navigate> is used
 *  to redirect other url routes like '/' and '/products to below route.
 */
router.get('/', productController.getProducts); 
router.get('/products', productController.getProducts); 
router.get('/products/all', productController.getProducts);  

router.get('/products/:category', productController.getProductsByCategory); // Route to get products by category

router.get('/products/all/:id', productController.getProductById);  // Routes to get product by id 
router.get('/products/:category/:id', productController.getProductById); 


export default router; // export this router for server.js

