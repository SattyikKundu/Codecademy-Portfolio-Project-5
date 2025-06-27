
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorMessageToast } from "../../utils/utilityFunctions";

import './cartCheckoutButton.css';

const CartCheckOutButton = ({toggleCart}) => {

  const cartItems       = useSelector((state) => state.cart.products);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const location = useLocation(); // initialize to find location
  const navigate = useNavigate(); // initialize for programmatic navigation

  const handleNavigate = () => {
    if(isAuthenticated && cartItems.length >0) { // is use is authenticated AND has at least 1 item in cart
        toggleCart?.(); 
        navigate('/checkout');
    }
    else if(isAuthenticated && (!cartItems || cartItems.length === 0)) { // If use authenticated, but has empty cart

        const isOnProductsPage = location.pathname.startsWith("/products"); // checks if "/products" is on url path

        if(isOnProductsPage) { // if on a "/products" route, close the cart slider
            toggleCart?.();            
        }
        else {
            toggleCart?.();
            navigate("/products/all"); // otherwise, redirect to default product listing 
                                       // (and close slider cart IF toggle function provided)
                       
        }
        ErrorMessageToast("You can't access checkout\nwith an empty cart!", 2500);
    }
    else if (!isAuthenticated) { // If user isn't logged in, redirect to login page
        toggleCart?.();
        navigate('/login', {
            state: {
                loginErrorMsg: 'NOTICE: ', 
                loginHeader: 'You must be logged in to enable cart checkout.'
            }
        });
        ErrorMessageToast("You must be logged in\nto enable cart checkout.", 2000);
    }
  }

  return (
      <button id="checkout-page-bttn" onClick={() => handleNavigate()}>To Checkout</button>
  );
}

export default CartCheckOutButton;