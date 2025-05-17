import React, {useState, useEffect} from "react";
import axios from "axios";
import Products from "../../PageComponents/products/products";

import './ProductsPage.css';

const ProductsPage = () => { // will modify later to handle various categories

    const [products,   setProducts]   = useState([]);  // Stores all fetched products
    const [pageNumber, setPageNumber] = useState(1);   // Stores index of current page (start at page '1')
    const productsPerPage             = 12;             // Nine products per page
    const [loading,    setLoading]    = useState(false); // tracks loading state
    const [error,      setError]      = useState('');    // stores error message as error comes 

    
    const fetchProducts = async () => { // function to fetch products 
        setLoading(true); // starts loading
        try {
            const response = await axios.get('http://localhost:5000/products'); // get products JSON object
            setProducts(response.data); // extract and save products data from JSON
        }
        catch (error) {
            setError(`Error with fetching products: ${error}`);
        }
        finally {
            setLoading(false); // loading finished
        }
    };
    
    useEffect(() => { // Fetch products when the component mounts
        fetchProducts(); 
    }, []);

    // Pagination logic:
    const indexOfLastProduct  = pageNumber * productsPerPage; // define index of last product on current page
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage; // define index of first product of current page
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct); // returns product to display for current page
    /* Example how logic works for 15 products (with 9 products per page):
     * For page=1:
     *  indexOfLastProduct  = (pageNumber) * (productsPerPage)         = 1 * 9 = 9
     *  indexOfFirstProduct = (indexOfLastProduct) - (productsPerPage) = 9 - 9 = 0 
     *  currentProducts = products.slice(0,9) <== shows all products of indexes 0-8 since 9 is not inclusive
     * 
     * For page=2:
     *   indexOfLastProduct  = (pageNumber) * (productsPerPage)         = 2 * 9 = 18
     *   indexOfFirstProduct = (indexOfLastProduct) - (productsPerPage) = 18 - 9 = 9
     *   currentProducts = products.slice(9,18) <= shows all products of indexes 9-17 (EVEN IF only 6 remaining instead of 9 products)
     */


    return (
        <>
        <div className="products-page">
            {/* For debugging */}
            {loading && (<h1>Loading...</h1>)}
            {error && (<h1>{error}</h1>)}

            {/* Display products */}
            <Products products={currentProducts} />

            {/* Buttons to navigate through products */}
            <div className="pagination-buttons">
                {Array.from( // Array.from() creates array based on iterable/arra-like object input
                    { length: Math.ceil(products.length / productsPerPage) }, // defines length of newly created array
                    (_, index) => ( // '_' is placeholder for current element & 'index' is current index value out of [0,length-1] indices
                    // Below is button created for each index (ex: If index=0, then index+1 means pageNumber=1)
                    <button key={index + 1} onClick={() => setPageNumber(index + 1)}> 
                        {index + 1}
                    </button>
                    ))
                }
            </div>

        </div>
        </>
    );
};

export default ProductsPage;