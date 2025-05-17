import express from 'express'; // imported to help create express app (to use as backend server)
import cors from 'cors';       // CORS middleware allows frontend (HTML/JS) to access server (backend) from a different origin
                               // Example: If HTML page is on localhost:5500 while backend server is on localhost:3000,
                               //          CORS enables these different ports (as well as subdomains) to communicate 

import productRoutes from './routes/productRoutes.js'; // import default export 'router' as 'productRoutes'

// Create express app
const app = express();
const port = 5000; // front-end port

// Mount middleware
app.use(cors());             // mount CORS middleware onto express app
app.use(express.json());     // tell express to parse ANY JSON data in the body 
                             // of incoming requests and conver that json data into 
                             // javascript object(s) the can be used via route handlers.

// Serves static images in 'public/images/' folder (MUST USE to access products' images!!!)
app.use('/images', express.static('public/images'));

//Mount product routes (for handling product-related requests)
app.use('/',productRoutes); // all routes from productRoutes are prefixed with '/' (e.g. '/products' , '/products/fishes')

// Default route for any other requests (Optional, for catch-all error handling)
//app.use('*', (req, res) => {
//  res.status(404).json({ error: 'Route not found' });
//});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});