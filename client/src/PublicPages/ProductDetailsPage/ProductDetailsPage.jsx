import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


import './ProductDetailsPage.css';

const ProductDetails = () => { 

    const {id :rawId, category: rawCategory} = useParams(); // Extract product 'category' and 'id' from url params
    const productid = rawId       || 'null';                // If product id empty/undefined, set to 'null'
    const category  = rawCategory || 'all';                 // Get product's category or use 'all' placeholder

    const [productData, setProductData] = useState(null); // holds product's data

    const [loading, setLoading] = useState(true); // tracks if page is loading
    const [error, setError] = useState(null); // tracks caught errors

    const fetchProductDetails = async() => { // Function to fetch product data
        setLoading(true); // start loading
        if(productid !== 'null') {
            try {
                /* Use axios.get() to fetch specific route path. 
                 * The reponse should have the product data since this route with productId 
                 * should trigger the associated controller function (see '/server/routes/productRoutes.js file).
                 */
                const response = await axios.get(`http://localhost:5000/products/${category}/${productid}`); 
                console.log('response value: ', response.data[0]);
                setProductData(response.data[0]); 
                //NOTE: Something like console.log('Data:',response.data[0]); wont work here because
                //      since state changes DO NOT happen immediately.
            }
            catch (error) { // Error if axios.get() fails
                console.log(`Error with getting data for product id=${productid}: `, error);
                setError(error);
            }
            finally {
                setLoading(false);
            }
        }
        else { // Error is product if is invalid
            console.log("There's now valid id for this product");
            setError("There's now valid id for this product");

            setLoading(false); // end of loading
        }
    }

    useEffect(() => { // fetches product's details on mount
        fetchProductDetails();
    },[]); // trigger only once at start of component mount

    /*
    useEffect(() => { // verifies updated productData
        if (productData) {
            console.log('Updated productData:', productData);
        }
    }, [productData]);*/

    return (
        <>
        {error && <h1>{error}</h1>}
        {
            (!loading && productData) && (
                <div className="product-description-container">
                    <p>Title: {productData.display_name} </p>
                </div>
                
            )
        }
        {/*<h1 style={{marginTop: '100px'}}> Product Details page</h1> */}
        </>
    );
}

export default ProductDetails;
