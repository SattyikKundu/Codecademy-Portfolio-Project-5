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

    useEffect(() => {
        if(productData && productData.image_url) { // if image_url exists, create image file path
            const imageFilePath = `http://localhost:5000/images/${productData.image_url}`;
            setImagePath(imageFilePath);
        }

        if (productData && productData.category) { // changes category value formatting for display 
            if (productData.category === 'fishes') {
                setDisplayCategory('Fishes');
            } else if (productData.category === 'invertebrates') {
                setDisplayCategory('Invertebrates');
            } else if (productData.category === 'corals_&_anemones') {
                setDisplayCategory('Corals & Anemones');
            }
        }
    }, [productData]); // triggers on productData change (especially for going from null)

    return (
        <>
        {error && <h1>{error}</h1>}
        {
            (!loading && productData) && (
                <div className="product-description-container">
                    <div className="image-and-data1-wrapper">
                        <div className="image-full-wrapper">
                            <img src={imagePath} alt={productData.display_name} className="product-image" />
                        </div>
                        <div className="data-part-1">
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
                    <div className="divider-bar" />
                    <div className="data-part-2">
                        {(displayCategory===('Fishes' || 'Invertebrates')) 
                        && (
                            <>
                            <div className="field-row">
                                <div className="field text-mid">Average Adult Size in Captivity: </div>
                                <div className="info">{productData.avg_adult_size}</div>
                            </div>
                            <div className="field-row">
                                <div className="field text-mid">Reef Safe(Is species safe for corals?): </div>
                                <div className="info">{productData.reef_safe}</div>
                            </div>
                            </>
                            )
                        }
                        {(displayCategory==='Corals & Anemones') 
                        && (
                            <>
                            <div className="field-row">
                                <div className="field text-mid">Lighting Needs: </div>
                                <div className="info"><ReactMarkdown>{productData.lighting_needs}</ReactMarkdown></div>
                            </div>
                            <div className="field-row">
                                <div className="field text-mid">Water Flow Needs: </div>
                                <div className="info"><ReactMarkdown>{productData.flow_needs}</ReactMarkdown></div>
                            </div>
                            <div className="field-row">
                                <div className="field text-mid">Placement Advice: </div>
                                <div className="info"><ReactMarkdown>{productData.placement_advice}</ReactMarkdown></div>
                            </div>
                            </>
                            )
                        }
                         <div className="field-col">
                            <div className="field">About this Species: </div>
                            <div className="info"><ReactMarkdown>{productData.about}</ReactMarkdown></div>
                        </div>
                        {/*
                            For fish/invert: 
                            Average Adult Size in Captivity:
                            Reef Safe(Is species safe for corals?): 
                        
                            For corals/anemones: 
                            Lighting needs:
                            Flow needs:
                            Placement Advice:

                            For All:
                            About:

                            Stock, price, add to cart button

                        */}
                    </div>
                    <div className="price-stock-cart">
                        <div className="price-stock">
                            <div className="price">
                                {productData.price}
                            </div>
                            <div className='stock'>
                                To be added...
                            </div>
                        </div>
                        <div className="add-to-cart-button-wrapper">
                            <div className="add-to-cart-button">
                                <FontAwesomeIcon icon={faCartPlus} className="add-to-cart-icon" />
                                <div id='add-button-text'>Add to Cart</div>
                            </div>
                        </div>
                    {/*
                    <div className="add-button-wrapper">
                        <div className="add-button">
                        <FontAwesomeIcon icon={faCartPlus} className="add-cart-icon" />
                        <div id='button-text'>Add to Cart</div>
                    </div>
                */}
                    </div>
                </div>
            )
        }
        </>
    );
}

export default ProductDetails;
