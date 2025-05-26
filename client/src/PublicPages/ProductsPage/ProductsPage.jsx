import {useState,   // react hook used to add and track states to component
        useEffect,  // react hook used to create and manage 'side-effects' that trigger on dependecy(-ies) change.
        //useMemo     // react hook used to memorize a value or function and only recalculates after dependency(-ies) change. 
        } from "react";
        
import { useParams } from "react-router-dom";
import axios from "axios";
import Products from "../../PageComponents/products/products";

import './ProductsPage.css';

const ProductsPage = () => { // will modify later to handle various categories

    // Normalize category
    const { category: rawCategory } = useParams(); // returns value of '/:category' parameter from url route 
    const category = rawCategory || 'all';         // if rawCategory is undefined, set to 'all'

    const [products,   setProducts]   = useState([]);  // stores all fetched products
    const [filtered,   setFiltered]   = useState([]);  // stores filtered products based on category

    const [pageNumber, setPageNumber] = useState(1);   // stores index of current page (start at page '1')
    const productsPerPage             = 8;             // 8 products per page

    const [error,         setError] = useState('');    // stores error message as error comes 
    const [loading,     setLoading] = useState(true);  // Track if data is being loaded

    const fetchAllProducts = async () => { // fetches all products from backend
        //if (products.length) return; // prevent re-fetch
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/products");
            setProducts(response.data); // Store products
            setFiltered(response.data); // initially store all products as fallback
        } 
        catch (error) {
            setError("Error fetching products: ", error.message);
        } 
        finally {
            setLoading(false);
        }
    };

    const filterByCategory = () => { // filter by products by category
        if (category === "all") {
            setFiltered(products);
        } 
        else {
            const filteredProducts = products.filter(
                (product) => product.category.toLowerCase() === category.toLowerCase()
            );
            setFiltered(filteredProducts);
        }    
    }

    useEffect(() => { // fetch all products at start of component mount
        if (!products.length || products.length === 0) {
            fetchAllProducts();
        }
    },[]);

    useEffect(() => { // filter by category and reset pagination page to 1.
        if (products && products.length>0) {
            filterByCategory();
            setPageNumber(1);
        }
    },[category, products]);
    
    

    // Pagination logic:
    const indexOfLastProduct  = pageNumber * productsPerPage; // define index of last product on current page
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage; // define index of first product of current page
    const currentProducts = filtered.slice(indexOfFirstProduct, indexOfLastProduct); 
    /* Example how logic works for 15 products (with 8 products per page):
     * For page=1:
     *  indexOfLastProduct  = (pageNumber) * (productsPerPage)         = 1 * 8 = 8
     *  indexOfFirstProduct = (indexOfLastProduct) - (productsPerPage) = 8 - 8 = 0 
     *  currentProducts = products.slice(0,8) <== shows all products of indices 0-7 since 8 is not inclusive
     * 
     * For page=2:
     *   indexOfLastProduct  = (pageNumber) * (productsPerPage)         = 2 * 8 = 16
     *   indexOfFirstProduct = (indexOfLastProduct) - (productsPerPage) = 16 - 8 = 8
     *   currentProducts = products.slice(8,16) <= Shows all products of indexes 8-15
     *                                             In practice, with 7 products left, its indices are 8-14.
     */

    return (
        <>
        <div className="products-page">

            {/* For debugging */}
            {/*loading && (<h1>Loading...</h1>)*/}
            {error && (<h1>{error}</h1>)}

            {!loading && (
            <>
            {/* Display products */}
            <Products products={currentProducts} />

            {/* Buttons to navigate through products */}
            <div className="pagination-buttons">
                {Array.from( // Array.from() creates array based on iterable/arra-like object input
                    { length: Math.ceil(filtered.length / productsPerPage) }, // defines length of newly created array
                    (_, index) => ( // '_' is placeholder for current element & 'index' is current index value out of [0,length-1] indices

                    // Below is button created for each index (ex: If index=0, then index+1 means pageNumber=1)
                    <button 
                        key={index + 1}                          // unique key value for pagination button
                        onClick={() => setPageNumber(index + 1)} // On click, get pagination page (with selected products slice)
                        className={((index+1) === pageNumber) ? 'selected-button': 'unselected-button'}  // style pagination button if current
                    > 
                        {index + 1}
                    </button>
                    ))
                }
            </div>
            </>
             )}
        </div>
        </>
    );
};

export default ProductsPage;