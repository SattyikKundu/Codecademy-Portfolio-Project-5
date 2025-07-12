import { useDispatch, useSelector} from 'react-redux';  // hooks used to dispatch slice/reducer actions and store 
                                                        // and read/update values to store state, respectively.

import { increaseByOne, decreaseByOne, deleteFromCart,} from '../../Slices/cartSlice.jsx'; // required selector methods

import axios from "axios"; // used to make HTTP request to backend
import { throttle } from 'lodash'; // throttle and useMemo to prevent button rapid-clicking
import { useMemo } from 'react';

import './checkoutCartItemCard.css';

const CheckoutCartItemCard = ({product}) => {

    const {  // props needed for cartItem card
        productId,  
        imageFileName, 
        name, 
        quantity, 
        unitPrice, 
        totalPrice, 
        quantityLimit
    } = product;

    const dispatch = useDispatch();  // initilize dispatch to use 'cart' reducer methods
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // tracks if user is logged in


    const throttleProductIncrease = useMemo(() => { // throttles item increase to prevent rapid clicks

      // Use useMemo() to ensure throttled function is only rendered/created once (retains internal state)
      // 'throttle' keeps internal timing; useMemo prevents re-creating it on each render (preserving behavior)
      return throttle( async (quantity, quantityLimit, productId, isAuthenticated) => {
        if(quantity < quantityLimit) {
          if (isAuthenticated) { // if logged in, cart item increased in backend database
            try {
              await axios.patch(
                //`http://localhost:5000/cart/${productId}/increase`, 
                `${process.env.VITE_API_BASE_URL}/cart/${productId}/increase`, 
                {}, {withCredentials: true});
            }
            catch(error) {
              console.log('throttleProductIncrease() error is: ', error);
            }
          }
        dispatch(increaseByOne({productId}));
        }
      }, 250);  // 250ms throttle delay (regardless of being logged in or logged out ('guest' mode))
    },[dispatch]); // Only recreate if dispatch changes (a placeholder since dispatch never changes)


    const throttleProductDecrease = useMemo(() => { // throttles item increase to prevent rapid clicks

      // Use useMemo() to ensure throttled function is only rendered/created once (retains internal state)
      // 'throttle' keeps internal timing; useMemo prevents re-creating it on each render (preserving behavior)
      return throttle( async (quantity, productId, isAuthenticated) => {
        if(quantity > 1) {
          if (isAuthenticated) { // if logged in, cart item increased in backend database
            try {
              await axios.patch(`http://localhost:5000/cart/${productId}/decrease`, {}, {withCredentials: true});
            }
            catch(error) {
              console.log('throttleProductDecrease() error is: ', error);
            }
          }
        dispatch(decreaseByOne({productId}));
        }
      }, 250);  // 250ms throttle delay (regardless of being logged in or logged out ('guest' mode))
    },[dispatch]); // Only recreate if dispatch changes (a placeholder since dispatch never changes)

    const handleProductIncrease = () => {
      throttleProductIncrease(quantity, quantityLimit, productId, isAuthenticated);
    }

    const handleProductDecrease = () => {
      throttleProductDecrease(quantity, productId, isAuthenticated);
    }

    const handleProductDelete = async() => { // useMemo() and throttle not needed here
      if (isAuthenticated) { // if logged in, cart item increased in backend database
        try {
          await axios.delete(`http://localhost:5000/cart/${productId}`,{withCredentials: true});
        }
        catch(error) {
             console.log('handleProductDelete() error is: ',error);
        }
      }
      dispatch(deleteFromCart({productId})); 
    }

    return (
      <>
      <div className="checkout-cart-item-wrapper">
        <div className="checkout-cart-item-content">

          {/* Holds product image for visual reference */}
          <div className='checkout-cart-item-img-wrapper'>
            <img src={`http://localhost:5000/images/${imageFileName}`} 
                 alt={name} 
                 className='checkout-cart-item-image' />   
          </div>

          {/* Hold cart item info as well as increase/decrease item quantity buttons */ }
          <div className='checkout-cart-item-info-buttons'>
            <div className='checkout-cart-item-info'>
              <div id='checkout-cart-item-name'>{name}</div>
              <div id='checkout-cart-item-price-total'>${totalPrice}</div>
              <div id='checkout-cart-item-price-each'>${unitPrice}/item</div>
            </div>
            <div className='checkout-cart-item-buttons'>
              <div 
                className={(quantity <= 1) 
                            ? "disable-decrease" 
                            : "decrease-by-one" 
                          }
                          onClick={()=>handleProductDecrease()}
                        >
                <span>–</span>
              </div>
              <div className='checkout-cart-item-quantity'>{quantity}</div>
              <div className={(quantity >= quantityLimit) 
                              ? "disable-increase" 
                              : "increase-by-one" 
                             }
                   onClick={()=>handleProductIncrease()}
              >
                <span>+</span>
              </div>
            </div>
          </div>

          {/* button to delete item from cart */}
          <div className='checkout-cart-delete-item-button' onClick={()=>handleProductDelete()}>✖</div>
        </div>
      </div>
      </>
    );
}

export default CheckoutCartItemCard;