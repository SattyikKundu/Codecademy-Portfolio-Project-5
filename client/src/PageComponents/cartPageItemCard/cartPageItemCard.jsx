import { 
         useDispatch, // hook used to dispatch a slice/reducer's actions
         useSelector  // reads values from store states and subscribes states to updates
        } from 'react-redux';


import { increaseByOne, 
         decreaseByOne,
         deleteFromCart,
         selectProductQuantityById // selector method for finding products current quantity in cart
        } from '../../Slices/cartSlice.jsx';

import axios from "axios"; // used to make HTTP request to backend
import { throttle } from 'lodash';
import { useMemo } from 'react';

import './cartPageItemCard.css';

const CartPageItemCard = ({product}) => {

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


    const throttleHandleItemIncrease = useMemo(() => { // throttles item increase to prevent rapid clicks

      // Use useMemo() to ensure throttled function is only rendered/created once (retains internal state)
      // 'throttle' keeps internal timing; useMemo prevents re-creating it on each render (preserving behavior)
      return throttle( async (quantity, quantityLimit, productId, isAuthenticated) => {
        if(quantity < quantityLimit) {
          if (isAuthenticated) { // if logged in, cart item increased in backend database
            try {
              await axios.patch(`http://localhost:5000/cart/${productId}/increase`, {}, {withCredentials: true});
            }
            catch(error) {
              console.log('handleItemIncrease() error is: ', error);
            }
          }
        dispatch(increaseByOne({productId}));
        }
      }, 250);  // 250ms throttle delay (regardless of being logged in or logged out ('guest' mode))
    },[dispatch]); // Only recreate if dispatch changes (a placeholder since dispatch never changes)

    const handleItemIncrease = () => {
      throttleHandleItemIncrease(quantity, quantityLimit, productId, isAuthenticated);
    }


    const throttleHandleItemDecrease = useMemo(() => { // throttles item increase to prevent rapid clicks

      // Use useMemo() to ensure throttled function is only rendered/created once (retains internal state)
      // 'throttle' keeps internal timing; useMemo prevents re-creating it on each render (preserving behavior)
      return throttle( async (quantity, productId, isAuthenticated) => {
        if(quantity > 1) {
          if (isAuthenticated) { // if logged in, cart item increased in backend database
            try {
              await axios.patch(`http://localhost:5000/cart/${productId}/decrease`, {}, {withCredentials: true});
            }
            catch(error) {
              console.log('handleItemDecrease() error is: ', error);
            }
          }
        dispatch(decreaseByOne({productId}));
        }
      }, 250);  // 250ms throttle delay (regardless of being logged in or logged out ('guest' mode))
    },[dispatch]); // Only recreate if dispatch changes (a placeholder since dispatch never changes)

    const handleItemDecrease = () => {
      throttleHandleItemDecrease(quantity, productId, isAuthenticated);
    }

    const handleItemDelete = async() => { // useMemo() and throttle not needed here
      if (isAuthenticated) { // if logged in, cart item increased in backend database
        try {
          await axios.delete(`http://localhost:5000/cart/${productId}`,{withCredentials: true});
        }
        catch(error) {
             console.log('handleItemDelete() error is: ',error);
        }
      }
      dispatch(deleteFromCart({productId})); 
    }


    return (
        <>
        <div className="cart-page-item-wrapper">
            <div className="cart-page-item-content">

                {/* Holds product image for visual reference */}
                <div className='cart-page-item-img-wrapper'>
                    <img src={`http://localhost:5000/images/${imageFileName}`} 
                         alt={name} 
                         className='cart-page-item-image' />   
                </div>

                {/* Hold cart item info as well as increase/decrease item quantity buttons */ }
                <div className='cart-page-item-info-buttons'>
                    <div className='cart-page-item-info'>
                        <div id='cart-page-item-name'>{name}</div>
                        <div id='cart-page-item-price-total'>${totalPrice}</div>
                        <div id='cart-page-item-price-each'>${unitPrice}/item</div>
                    </div>
                    <div className='cart-page-item-buttons'>
                        <div 
                            className={(quantity <= 1) 
                                        ? "disable-decrease" 
                                        : "decrease-by-one" 
                                      }
                            onClick={()=>handleItemDecrease()}
                        ><span>–</span></div>
                        <div className='cart-page-quantity'>{quantity}</div>
                        <div 
                            className={(quantity >= quantityLimit) 
                                        ? "disable-increase" 
                                        : "increase-by-one" 
                                      }
                            onClick={()=>handleItemIncrease()}
                        ><span>+</span></div>
                    </div>
                </div>

                {/* button to delete item from cart */}
                <div 
                    className='cart-page-delete-item-button'
                    onClick={()=>handleItemDelete()}
                >
                ✖
                </div>
            </div>
        </div>
        </>
    );
}

export default CartPageItemCard;
