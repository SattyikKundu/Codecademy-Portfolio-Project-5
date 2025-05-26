import productModel from '../model/productModel.js';

const getProducts = async(req, res) => { // controller function for getting all products
    try {
        const products = await productModel.getAllProducts(); // call model and method
        res.json(products); // converts products into JSON response 
    }
    catch (error) { // handle error
        res.status(500).json({error: 'Failed to retrieve products'});
    }
}

const getProductsByCategory = async(req, res) => { // controller function for getting all products for given category

    const { category } = req.params; // extract 'category' from req.params

    try {
        const products = await productModel.getProductsByCategory(category); // call model method and pass 'category'
        if (products.length > 0) { // check if products isn't empty
            res.json(products); // converts products to JSON response
        }
        else if (products.length === 0) {
            return res.status(404).json({error: `No products found for category '${category}'`});;
        }
    }
    catch (error) {
        res.status(500).json({error: `Failed to retrieve any products for '${category}'`});
    }
}

const getProductById = async(req, res) => { // controller function for getting all product data for 1 product (via product id)
    const { id } = req.params; //  extract product 'id' from req.params

    try {
        const product = await productModel.getProductById(id); // get product 
        if (product.length === 1) { // there should ONLY be 1 product for the id
            res.json(product); // converts product data into JSON response
        }
        else if (!product) {
            return res.status(404).json({ error: 'Product not found in database.'});
        }
        else if (product.length>1) {
            return res.status(500).json({ error: 'Duplicates of product found in database. This should not happen!'});
        }
    }
    catch(error) {
        res.status(500).json({error: `Issue retrieving product: ${error}`});
    }
} 

const productController = {getProducts, getProductsByCategory, getProductById};
export default productController ; // export controller functions



/*
import { redisClient } from '../server.js'; // Import the redisClient from server.js
import productModel from '../model/model.js';

const getProducts = async(req, res) => { 
    try {
        redisClient.get('allProducts', async (err, data) => {
            if (data) {
                console.log('Fetching from Redis cache');
                return res.json(JSON.parse(data)); // If data is found in Redis, return it
            } else {
                console.log('Fetching from database');
                const products = await productModel.getAllProducts(); // Fetch from database
                redisClient.set('allProducts', JSON.stringify(products)); // Cache the products in Redis
                res.json(products); // Send the products as a JSON response
            }
        });
    }
    catch (error) {
        res.status(500).json({error: 'Failed to retrieve products from database or cache'});
    }
};

const getProductsByCategory = async(req, res) => { 
    const { category } = req.params;
    try {
        redisClient.get(`products:${category}`, async (err, data) => {
            if (data) {
                console.log(`Fetching ${category} from Redis cache`);
                return res.json(JSON.parse(data)); // If data is found in Redis, return it
            } else {
                console.log(`Fetching ${category} from database`);
                const products = await productModel.getProductsByCategory(category); // Fetch from database
                redisClient.set(`products:${category}`, JSON.stringify(products)); // Cache the products in Redis
                res.json(products); // Send the products as a JSON response
            }
        });
    }
    catch (error) {
        res.status(500).json({error: `Failed to retrieve products for category '${category}'`});
    }
};

const getProductById = async(req, res) => { 
    const { id } = req.params;
    try {
        // Check if product data is cached in Redis
        redisClient.get(`product:${id}`, async (err, data) => {
            if (data) {
                console.log(`Fetching product with ID ${id} from Redis cache`);
                return res.json(JSON.parse(data)); // If data is found in Redis, return it
            } else {
                console.log(`Fetching product with ID ${id} from database`);
                const product = await productModel.getProductById(id); // Fetch from database
                if (product.length === 1) {
                    redisClient.set(`product:${id}`, JSON.stringify(product)); // Cache the product in Redis
                    res.json(product); // Send the product as JSON response
                } else {
                    res.status(404).json({error: 'Product not found'});
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({error: `Error retrieving product by ID: ${error}`});
    }
};

const productController = { getProducts, getProductsByCategory, getProductById };
export default productController; */


/*
import express from 'express';
import cors from 'cors';
import redis from 'redis';
import productRoutes from './routes/productRoutes.js';

const app = express();
const port = 5000; // Backend port

// Set up Redis client
const redisClient = redis.createClient({
  host: 'localhost',   // Ensure Redis is running locally or change to your Redis server configuration
  port: 6379           // Default Redis port
});

// Set up Redis connection
redisClient.connect()
  .then(() => console.log('Redis connected'))
  .catch(err => console.log('Redis connection error: ', err));

app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));  // Serve static images

// Mount product routes
app.use('/', productRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

*/