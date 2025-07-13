import {useEffect, useState} from "react";
import axios from "axios"; // used to make HTTP request to backend

import { useParams,      // extract parameter values from route's url
         useNavigate,    // used to handle url routes programatically
         useSearchParams // extract search param value from route's url
        } from "react-router-dom"; 

import { 
         useDispatch, // hook used to dispatch a slice/reducer's actions
         useSelector  // reads values from store states and subscribes states to updates
        } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

import { 
        addToCart,                  // slice method for adding product to cart
        selectProductQuantityById   // selector method for finding product's current quantity in cart
       } from '../../Slices/cartSlice.jsx'; 

import { addedToCartToast } from "../../utils/utilityFunctions"; // toast function when product added to cart

import { throttle } from "lodash";
import { useMemo } from "react";

import './productCard.css';

const Product = ({product}) => {

    const navigate = useNavigate(); // initialize to enable route navigation

    const [stockMessage,      setStockMessage] = useState('In Stock'); // Message on product's stock
    const [stockState,       setStockState]    = useState('stocked');  // define style for <div> holding stockMessage
    const [productDetailsLink, setProductDetailsLink]  = useState(''); // store link to product details page

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // checks user authentication    

    // Normalize category (used to create product)
    const { category: rawCategory } = useParams();  // returns value of '/:category' parameter from url route 
    const category = rawCategory || 'all';         // if rawCategory is undefined, set to 'all' (which is supported in backend)

    // create file path to access product's image
    const imgPath = `${import.meta.env.VITE_API_BASE_URL}/images/${product.image_url}`; // file path for product image (must match port in server.js file)

    const dispatch = useDispatch();  // initilize dispatch to use 'cart' reducer methods

    const currentQuantity = useSelector( // get current quantity of product in store (if product NOT in cart store, returns 0)
        (state) => selectProductQuantityById(state, product.id)
    );  
    const purchaseLimit = (product.stock < 10) ? product.stock : 10; // define purchase limit of up to 10 (or less if stock under 10)
    const disableAdd = (product.stock===0 ||(currentQuantity === purchaseLimit)) ? true : false; // If stock empty (or hit purchase limit)

    const itemToAdd = {   // product data for adding product to cart state in store!
        'productId':     product.id, 
        'imageFileName': product.image_url,
        'name':          product.display_name, 
        'quantity':      1, // default quantity amount added upon 'Add to Cart' click
        'unitPrice':     product.price,  
        'totalPrice':    product.price, // initial placeholder (will be updated in cartSlice) 
        'quantityLimit':   purchaseLimit
    }

    const throttledAddToCart = useMemo(() => { // throttles 'Add to Cart' to prevent rapid clicks

      // Use useMemo() to ensure throttled function is only rendered/created once (retains internal state)
      // 'throttle' keeps internal timing; useMemo prevents re-creating it on each render (preserving behavior)
      return throttle(async (productId, itemToAdd, isAuthenticated) => { 
        if (isAuthenticated) { // if logged in, add product to backend cart
          try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/cart/${productId}/add`, {}, {withCredentials:true}
            );
          } 
          catch (error) {
            console.error('handleAddToCart() error:', error);
          }
        }
        dispatch(addToCart(itemToAdd)); // dispatch adding cart items to redux as normal
        addedToCartToast();
      }, 250);     // 250ms throttle delay (regardless of being logged in or logged out ('guest' mode))
    }, [dispatch]); // Only recreate if dispatch changes (a placeholder since dispatch never changes)

    const handleAddToCart = () => { // button linked-function for adding to cart
      throttledAddToCart(product.id, itemToAdd, isAuthenticated);
    };


    const createProductDetailsLink = () => { // function creates the product details url link for the page
        let detailsLink = ''; // placeholder to store final url route

        if (category && product.id) { // If product has both id and category
            detailsLink = `/products/${category}/${product.id}`;
            setProductDetailsLink(detailsLink);
        }
        else { // throw error if product id is unavailable
            console.error(`Unable to create details link for ${stock.display_name} due to missing id`);
            throw error; 
        }
    }
        
    const clickForDetails = () => { // navigate to product details page
        navigate(productDetailsLink);
    }


    const checkStockState = () => { // function checks products stock and return message
        if(product.stock > 10) {
            setStockMessage('In Stock');
            setStockState('stocked');
        }
        else if (product.stock<=10 && product.stock>1) {
            setStockMessage(`Only ${product.stock} left!`);
            setStockState('low');
        }
        else if (product.stock===0 || product.stock===null) {
            setStockMessage('Out of Stock');
            setStockState('none');
        }
        else { // throw error if stock value invalid/unavailable
            console.error(`Unable to retrieve stock of ${product.display_name}`);
            throw error; 
        }
    }

    
    const highlightText = (text) => { // Highlight search term INSIDE product name when use searchs product in search bar

        const [searchParams] = useSearchParams(); // get search param from url
        const searchQuery = searchParams.get("search")?.toLowerCase(); // lowercase the search term

        if (!searchQuery || !text.toLowerCase().includes(searchQuery)) { // If no search query, return text as is
            return <span>{text}</span>;
        } 

        const index = text.toLowerCase().indexOf(searchQuery); // get starting index of search query term
        const before = text.slice(0, index);                   // portion of text BEFORE hightlighted section of name
        const match = text.slice(index, index + searchQuery.length); // highlighted section of name matching search term
        const after = text.slice(index + searchQuery.length);        // text portion AFTER highlighted section of name

        return ( // <span> ensures all text functions as ONE unit (no awkward broken sentence strings)
            // <mark> is still inline, but nested correctly inside an inline container 
            <div>
                <span>{before}</span>
                <mark>{match}</mark> 
                <span>{after}</span>
            </div>
        );
    };

    useEffect(() => { // checks stock state and if product details link work on mount
        createProductDetailsLink();
        checkStockState();
    },[]);

    return (
      <>
        <div className="product-card">
            <div className="product-info-wrapper" onClick={()=>clickForDetails()}>
                <div className="image-wrapper">
                    <img src={imgPath} alt={product.display_name} className="product-image" />
                </div>
                <div className='product-name'>
                    {/* Ensures search term can be higlighted */}
                    {highlightText(product.display_name)}
                </div>
            </div>
            <div className="price-and-stock">
                <div id='price'>
                    ${product.price}
                </div>
                <div id='stock' className={`${stockState}`}>
                    {stockMessage}
                </div>
            </div>
            <div className="add-button-wrapper" onClick={ !disableAdd && (()=>handleAddToCart()) }>
                <div className={`add-button ${(disableAdd) && 'button-disabled'}`}>
                    <FontAwesomeIcon icon={faCartPlus} className="add-cart-icon" />
                    <div id='button-text'>
                       { (!disableAdd) ? ('Add to Cart') : ("Can't Add More")} 
                    </div>
                </div>
            </div>
        </div>
      </>
    );
};

export default Product;

