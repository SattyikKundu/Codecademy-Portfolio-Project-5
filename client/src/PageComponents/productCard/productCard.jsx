import {useEffect, useState} from "react";
//import { Link } from "react-router-dom";

import { useParams, useNavigate } from "react-router-dom"; // used to handle url routes programatically

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

import './productCard.css';

const Product = ({product}) => {

    const imgPath = `http://localhost:5000/images/${product.image_url}`; // file path for product image (must match port in server.js file)

    const navigate = useNavigate();

    const [stockMessage, setStockMessage] = useState('In Stock'); // Message on product's stock
    const [stockState, setStockState]     = useState('stocked');  // used to define style for <div> holding stockMessage

    // Normalize category (used to create product)
    const { category: rawCategory } = useParams();  // returns value of '/:category' parameter from url route 
    const category = rawCategory || 'all';         // if rawCategory is undefined, set to 'all' (which is supported in backend)

    const [productDetailsLink, setProductDetailsLink]  = useState(''); // used to store the link to product details page


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
        
    const clickForDetails = () => {
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


   // useEffect(() => {
   //     checkStockState();
   // },[product, product.stock]); // function run on mount or when product (or product.stock) changes

    useEffect(() => {
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
                    {product.display_name}
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
            <div className="add-button-wrapper">
                <div className="add-button">
                    <FontAwesomeIcon icon={faCartPlus} className="add-cart-icon" />
                    <div id='button-text'>Add to Cart</div>
                </div>
            </div>
        </div>
      </>
    );
};

export default Product;

