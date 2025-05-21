import React, {useState, useEffect} from "react";
import ReactMarkdown from 'react-markdown';
import { useParams } from "react-router-dom";
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

import './ProductDetailsPage.css';

const ProductDetails = () => { 

    const {id :rawId, category: rawCategory} = useParams(); // Extract product 'category' and 'id' from url params
    const productid = rawId       || 'null';                // Get product id, or set to 'null' if undefined/missing
    const category  = rawCategory || 'all';                 // Get product's category, or use 'all' placeholder
    const [displayCategory, setDisplayCategory] = useState('All'); // Contains reformatted product category name for display

    const [productData, setProductData] = useState(null); // holds product's data
    const [imagePath, setImagePath] = useState(null);     // holds file path to product image

    const [stockMessage, setStockMessage] = useState('In Stock'); // Message on product's stock
    const [stockState, setStockState]     = useState('stocked');  // used to define style for <div> holding stockMessage


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
            const imageFilePath = `http://localhost:5000/images/${productData.image_url}`;
            setImagePath(imageFilePath);
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
        {
            (!loading && productData) && (
                <div className="product-description-container">
                    <div className="image-and-part-1-data-wrapper">
                        <div className="product-image-wrapper">
                            <img src={imagePath} alt={productData.display_name} className="product-image" />
                        </div>
                        {/* Product Fields covered in Part 1 data (for all categories): 
                          *   Product's display name:     productData.display_name
                          *   Common alternative names:   productData.other_names 
                          *   Scientific name:            productData.sci_name  
                          *   Category:                   productData.category => converted via setDisplayCategory() => displayCategory
                          *   Species type:               productData.species_type
                          *   Tank roles:                 productData.tank_roles
                          *   Temperament:                productData.temperament
                          *   General care level needed:  productData.care_level
                          * 
                          *   NOTE: some field values are wrapped with <ReactMarkdown></ReactMarkdown> to 
                          *         format text portions in PostgreSQL into italics(from *text*) or bold(from **text**).
                          */}
                        <div className="part-1-data">
                            <div className="field-row">
                                <div className="field">Name: </div>
                                <div className="info">{productData.display_name}</div>
                            </div>
                            <div className="field-row">
                                <div className="field">Other Names: </div>
                                <div className="info"><ReactMarkdown>{productData.other_names}</ReactMarkdown></div>
                            </div>
                            <div className="field-row">
                                <div className="field">Scientific Name: </div>
                                <div className="info"><ReactMarkdown>{productData.sci_name}</ReactMarkdown></div>
                            </div>
                            <div className="field-row">
                                <div className="field">Category: </div>
                                <div className="info">
                                    {displayCategory}
                                </div>
                            </div>
                            <div className="field-row">
                                <div className="field">Species Type: </div>
                                <div className="info">{productData.species_type}</div>
                            </div>
                            <div className="field-row">
                                <div className="field">Common Tank Roles: </div>
                                <div className="info"><ReactMarkdown>{productData.tank_roles}</ReactMarkdown></div>
                            </div>
                            <div className="field-row">
                                <div className="field">General Temperament Level: </div>
                                <div className="info">{productData.temperament}</div>
                            </div>
                            <div className="field-row last-row">
                                <div className="field">General Care Level Needed: </div>
                                <div className="info">{productData.care_level}</div>
                            </div>
                        </div>
                    </div>
                    <div className="divider-bar-1" />
                        {/* Product Fields covered in Part 2 data (for all or chosen categories): 
                          * For Fish and Invertebrates:                 
                          * Average Adult Size in Captivity:     productData.avg_adult_size
                          * Reef Safe:                           productData.reef_safe
                          *
                          * For Corals & Anemones: 
                          * Lighting needs:             productData.lighting_needs
                          * Flow needs:                 productData.flow_needs
                          * Placement Advice:           productData.placement_advice
                          *        
                          * For All:
                          * About:                      productData.about
                          * Stock:                      productData.stock ==> converted via checkStockState() ==> stockMessage
                          * Price:                      productData.price
                          *        
                          * NOTE: Like before, some field values are wrapped in <ReactMarkdown></ReactMarkdown>
                          *       to handle text bolding and italicization.
                          */}
                    <div className="data-part-2">
                        {(displayCategory===('Fishes') || displayCategory===('Invertebrates')) 
                        && (
                            <>
                            <div className="field-row">
                                <div className="field">Average Adult Size in Captivity: </div>
                                <div className="info">{productData.avg_adult_size}</div>
                            </div>
                            <div className="field-row">
                                <div className="field">Reef Safe(Is species safe for corals?): </div>
                                <div className="info">{productData.reef_safe}</div>
                            </div>
                            </>
                            )
                        }
                        {(displayCategory==='Corals & Anemones') 
                        && (
                            <>
                            <div className="field-row">
                                <div className="field">Lighting Needs: </div>
                                <div className="info"><ReactMarkdown>{productData.lighting_needs}</ReactMarkdown></div>
                            </div>
                            <div className="field-row">
                                <div className="field">Water Flow Needs: </div>
                                <div className="info"><ReactMarkdown>{productData.flow_needs}</ReactMarkdown></div>
                            </div>
                            <div className="field-row">
                                <div className="field">Placement Advice: </div>
                                <div className="info"><ReactMarkdown>{productData.placement_advice}</ReactMarkdown></div>
                            </div>
                            </>
                            )
                        }
                         <div className="field-col">
                            <div className="field">About this Species: </div>
                            <div className="info"><ReactMarkdown>{productData.about}</ReactMarkdown></div>
                        </div>
                    </div>
                    <div className="price-stock-cart">
                        <div className="price-stock">
                            <div id="price-notice">
                                ${productData.price}
                            </div>
                            <div id='stock-notice' className={`${stockState}`}>
                                {stockMessage}
                            </div>
                        </div>
                        <div className="divider-bar-2" />
                        <div className="add-to-cart-button-wrapper">
                            <div className="add-to-cart-button">
                                <FontAwesomeIcon icon={faCartPlus} className="add-to-cart-icon" />
                                <div id='add-button-text'>Add To Cart</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        </>
    );
}

export default ProductDetails;

