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