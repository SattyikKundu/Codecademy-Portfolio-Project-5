import {useState, useEffect} from "react";

import { useParams } from "react-router-dom";
import axios from "axios"; // used to retrieve product data via express backend using '/:id'
import ProductDetails from "../../PageComponents/productDetails/productDetails";

import FooterBottom from "../../PageComponents/footerBottom/footerBottom";

import './ProductDetailsPage.css';

const ProductDetailsPage = () => { 

    const {id :rawId, category: rawCategory} = useParams(); // Extract product 'category' and 'id' from url params
    const productid = rawId       || 'null';                // Get product id, or set to 'null' if undefined/missing
    const category  = rawCategory || 'all';                 // Get product's category, or use 'all' placeholder
    const [displayCategory, setDisplayCategory] = useState('All'); // Contains reformatted product category name for display

    const [productData,     setProductData] = useState(null); // holds product's data
    const [imageFileName, setImageFileName] = useState(null); // holds image file name for product image

    const [stockMessage, setStockMessage] = useState('In Stock'); // Message on product's stock
    const [stockState, setStockState]     = useState('stocked');  // used to define style for <div> holding stockMessage


    const [loading, setLoading] = useState(true); // tracks if page is loading
    const [error, setError] = useState(null);     // tracks caught errors

    const fetchProductDetails = async() => {      // Function to fetch product data
        setLoading(true); // start loading
        if(productid !== 'null') {
            try {
                /* Use axios.get() to fetch specific route path. 
                 * The reponse should have the product data since this route with productId 
                 * should trigger the associated controller function (see '/server/routes/productRoutes.js file).
                 */
                const response = await axios.get(`http://localhost:5000/products/${category}/${productid}`); 
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

    const checkStockState = () => { // function checks products stock and return message
        if(productData.stock > 10) {
            setStockMessage('In Stock');
            setStockState('stocked');
        }
        else if (productData.stock<=10 && productData.stock>1) {
            setStockMessage(`Only ${productData.stock} left!`);
            setStockState('low');
        }
        else if (productData.stock===0 || productData.stock===null) {
            setStockMessage('Out of Stock');
            setStockState('none');
        }
        else { // throw error if stock value invalid/unavailable
            console.error(`Unable to retrieve stock of ${productData.display_name}`);
            throw error; 
        }
    }

    const setProductCategory = () => {
        if (productData.category === 'fishes') {
            setDisplayCategory('Fishes');
        } 
        else if (productData.category === 'invertebrates') {
            setDisplayCategory('Invertebrates');
        } 
        else if (productData.category === 'corals_&_anemones') {
            setDisplayCategory('Corals & Anemones');
        }
        else { // throw error if category value invalid/unavailable
            console.error(`Invalid category for ${productData.display_name}: `,productData.category);
            throw error; 
        }
    }


    useEffect(() => { // fetches product's details on mount
        fetchProductDetails();
    },[]); // trigger only once at start of component mount

    useEffect(() => {
        if(productData && productData.image_url) { // if image_url exists, create image file path
            setImageFileName(productData.image_url);
        }

        if (productData && productData.category) { // changes category value formatting for display 
            setProductCategory();
        }

        /* Check if productData.stock has number, 0, or null before updating product's stock notice */
        if (productData && (productData.stock === 0 || productData.stock || productData.stock === null)) { 
            checkStockState();
        }
    }, [productData]); // triggers on productData change (especially for going from null)

    return (
      <>
      {error && <h1>{error}</h1>}
      {/* Need conditions below to prevent page from prematurely failing (being blank) */}
      {
        (!loading && productData) && (
          <>
          <div className="product-details-page-full" data-bg-var-repaint>
            <ProductDetails 
              imageFileName   ={imageFileName}
              productData     ={productData} 
              displayCategory ={displayCategory}
              stockState      ={stockState} 
              stockMessage    ={stockMessage}
            />
          <FooterBottom />
          </div>
          </>
        )
        }
        </>
    );
}

export default ProductDetailsPage;

