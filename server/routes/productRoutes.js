
import productController from '../controller/controller.js';
import express from 'express';

//const express = require('express'); // use express to create routes
const router = express.Router(); // define router to group all routes related to interacting with products data


router.get('/products', productController.getProducts); // Route to get all products

router.get('/products/:category', productController.getProductsByCategory); // Route to get products by category

export default router; // export this router for server.js

