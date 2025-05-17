
import pool from '../database/database.js'; // import pool to interact with database

const getAllProducts = async() => { // function returns all products
    try {
        const products = await pool.query ('SELECT * FROM products');
        return products.rows;
    }
    catch (error) {
        console.error('Error fetching products: ',error);
        throw error; // when error occurs, this raises exception and stops program execution.
    }
}

const getProductsByCategory = async(category) => { // get products via products' category
    try {
        const products = await pool.query('SELECT * FROM products WHERE category=$1',[category]); // parametize query to limit SQL injection attack
        return products.row;
    }
    catch(error) {
        console.log(`Error fetching products for '${category}': `, error);
        throw error;
    }
}

const productModel = {getAllProducts, getProductsByCategory};
export default productModel; // = {getAllProducts, getProductsByCategory}; // export productModel functions
