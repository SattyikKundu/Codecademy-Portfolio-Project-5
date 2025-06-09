import ReactMarkdown from "react-markdown"; // Used to handle markup language from 
                                            // database and convert to bold/italics/etc. 

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // used to import FontAwesomeIcons
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

import { 
         useDispatch, // hook used to dispatch a slice/reducer's actions
         useSelector  // reads values from store states and subscribes states to updates
        } from 'react-redux';

import { 
        addToCart,                  // slice method for adding product to cart
        selectProductQuantityById   // selector method for finding product's current quantity in cart
       } from '../../Slices/cartSlice.jsx'; 

import axios from "axios"; // used to make HTTP request to backend

import {addedToCartToast } from "../../utils/utilityFunctions.js";

import { useParams } from 'react-router-dom';


import { throttle } from 'lodash';
import { useMemo } from "react";

import './productDetails.css'; // styling for Product details display

/* Below <ProductDetails /> component is nested within the <ProductDetailsPage /> component of ProductDetailsPage.jsx.
 * Within ProductDetailsPage.jsx, several data props/parameters is passed onto the <ProductDetails />
 * component to fill in the necessary fields in order to display all necessary product details.
 * Ultimately, this separation of the output handling from the ProductDetailsPage.jsx file improves modularization.
 */

const ProductDetails = ({ imageFileName, productData, displayCategory, stockState, stockMessage }) => {

    const dispatch = useDispatch();  // initilize dispatch to use 'cart' reducer methods

    /* get current quantity of product in store (if product NOT in cart store, returns 0) */
    const currentQuantity = useSelector((state) => selectProductQuantityById(state, productData.id));  

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // checks if user is logged in
    const purchaseLimit = (productData.stock < 10) ? productData.stock : 10;    // define purchase limit of up to 10 (or less if stock under 10)
    const disableAdd = (productData.stock===0 ||(currentQuantity === purchaseLimit)) ? true : false; // If stock empty (or hit purchase limit)
    const {id} = useParams(); // gets product id from url params ('/products/:category/:id')

    const itemToAdd = {   // product data for adding product to cart state in store!
        'productId':     productData.id, 
        'imageFileName': imageFileName,
        'name':          productData.display_name, 
        'quantity':      1, // default quantity increase upon 'Add to Cart' click
        'unitPrice':     productData.price,  
        'totalPrice':    productData.price, // initial placeholder (will be updated in cartSlice) 
        'quantityLimit':  purchaseLimit
    }


    const throttledAddToCart = useMemo(() => { // throttles 'Add to Cart' to prevent rapid clicks

      // Use useMemo() to ensure throttled function is only rendered/created once (retains internal state)
      // 'throttle' keeps internal timing; useMemo prevents re-creating it on each render (preserving behavior)
      return throttle(async (productId, itemToAdd, isAuthenticated) => {
        if (isAuthenticated) { // if logged in, add product to backend cart
          try {
            await axios.post(`http://localhost:5000/cart/${productId}/add`, {}, {withCredentials:true});
          } 
          catch (error) {
            console.error('handleAddToCart() error:', error);
          }
        }
        dispatch(addToCart(itemToAdd)); // dispatch adding cart items to redux as normal
        addedToCartToast();
      }, 250); // 250ms throttle delay (regardless of being logged in or logged out ('guest' mode))
    }, [dispatch]); // Only recreate if dispatch changes (a placeholder since dispatch never changes)

    const handleAddToCart = () => { // button-linked function for adding to cart
      throttledAddToCart(id, itemToAdd, isAuthenticated);
    };

    return (
        <div className="product-description-container">
            <div className="image-and-part-1-data-wrapper">
                <div className="product-image-wrapper">
                    <img 
                        src={`http://localhost:5000/images/${imageFileName}`} 
                        alt={productData.display_name} 
                        className="product-image" 
                    />
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
                        <div className="info">{displayCategory}</div>
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
                {(displayCategory===('Fishes') || displayCategory===('Invertebrates')) && 
                (
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
                )}
                {(displayCategory==='Corals & Anemones') && 
                (
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
                )}
                <div className="field-col">
                    <div className="field">About this Species: </div>
                    <div className="info"><ReactMarkdown>{productData.about}</ReactMarkdown></div>
                </div>
            </div>
            <div className="price-stock-cart">
                <div className="price-stock">
                    <div id="price-notice"> ${productData.price}</div>
                    <div id='stock-notice' className={`${stockState}`}>{stockMessage}</div>
                </div>
                <div className="divider-bar-2" />
                {/* Button adds product to cart */}
                <div className="add-to-cart-button-wrapper" onClick={ !disableAdd && (()=>handleAddToCart())}>
                    {/* Button style changes when active or disabled */}
                    <div className={`add-to-cart-button ${(disableAdd) && 'add-button-disabled'}`} >
                        <FontAwesomeIcon icon={faCartPlus} className="add-to-cart-icon" />
                        <div id='add-to-cart-button-text'>
                            { (!disableAdd) ? ('Add to Cart') : ("Can't Add More")} 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
