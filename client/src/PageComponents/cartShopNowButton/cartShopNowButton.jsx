import { useLocation, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import {faStore} from '@fortawesome/free-solid-svg-icons';

import './cartShopNowButton.css';

const ShopNowButton = ({toggleCart, emptyCartMessage='Shop to add products...'}) => {

    const location = useLocation(); // initilize to find location
    const navigate = useNavigate(); // initalize to navigate to 'products/all' if needed

    const handleShopNowClick = () => { // function for "Shop Now" button

        const isOnProductsPage = location.pathname.startsWith("/products"); // checks if '/products' is on url path

        if (isOnProductsPage) { // If already on a products page, just close slider (IF function passed)
            toggleCart?.();  
        } else {
            navigate("/products/all"); // otherwise, redirect to default product listing 
                                       // (and close slider cart IF toggle function provided)
            toggleCart?.();            
        }
    };


    return ( // returns button component
        <div className="empty-cart-notice">
            <div id='empty-cart-message'>{emptyCartMessage}</div>
            <div onClick={() => handleShopNowClick()} className="shop-now-button">
                <FontAwesomeIcon icon={faStore} className="shop-now-icon" />
                <div id='shop-now-text'>Shop Now</div>
            </div>
        </div>
    );

}

export default ShopNowButton;