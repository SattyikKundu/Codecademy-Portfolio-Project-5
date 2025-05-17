
import productModel from '../model/model.js';

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
        res.status(500).json({error: `Failed to retrieve products for '${category}'`});
    }
}


const productController = {getProducts, getProductsByCategory};
export default productController ; // export controller functions