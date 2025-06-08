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

import './cartSliderItemCard.css';

const CartSliderItemCard = ({product}) => {

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
    
    const handleIncrease = async() => {
      if(quantity < quantityLimit) {
        if (isAuthenticated) { // if logged in, cart item increased in backend database
          try {
            await axios.patch(
              `http://localhost:5000/cart/${productId}/increase`,
              {},
              {withCredentials: true}
            );
          }
          catch(error) {
            console.log('handleIncrease() error is: ',error);
          }
        }
        dispatch(increaseByOne({productId}));
      }
    }

    const handleDecrease = async() => {
      if (quantity > 1) {
        if (isAuthenticated) { // if logged in, cart item increased in backend database
          try {
            await axios.patch(
              `http://localhost:5000/cart/${productId}/decrease`,
              {},
              {withCredentials: true}
            );
          }
          catch(error) {
            console.log('handleDecrease() error is: ',error);
          }
        }
        dispatch(decreaseByOne({productId}));
      }
    }

    const handleDelete = async() => {
      if (isAuthenticated) { // if logged in, cart item increased in backend database
        try {
          await axios.delete(
            `http://localhost:5000/cart/${productId}`,
            {withCredentials: true}
          );
        }
        catch(error) {
          console.log('handleDelete() error is: ',error);
        }
      }
      dispatch(deleteFromCart({productId})); 
    }

    return (
        <>
        <div className="cart-slider-item-wrapper">
            <div className="cart-slider-item-content">

                {/* Holds product image for visual reference */}
                <div className='cart-slider-item-img-wrapper'>
                    <img src={`http://localhost:5000/images/${imageFileName}`} 
                         alt={name} 
                         className='cart-slider-item-image' />
                </div>

                {/* Hold cart item info as well as increase/decrease item quantity buttons */ }
                <div className='cart-slider-item-info-buttons'>
                    <div className='cart-slider-item-info'>
                        <div id='cart-item-name'>{name}</div>
                        <div id='cart-item-price-total'>${totalPrice}</div>
                        <div id='cart-item-price-each'>${unitPrice}/item</div>
                    </div>
                    <div className='cart-slider-item-buttons'>
                        <div 
                            className={(quantity <= 1) 
                                        ? "disable-decrease" 
                                        : "decrease-by-one" 
                                      }
                            onClick={()=>handleDecrease()}
                        ><span>–</span></div>
                        <div className='cart-quantity'>{quantity}</div>
                        <div 
                            className={(quantity >= quantityLimit) 
                                        ? "disable-increase" 
                                        : "increase-by-one" 
                                      }
                            onClick={()=>handleIncrease()}
                        ><span>+</span></div>
                    </div>
                </div>

                {/* button to delete item from cart */}
                <div 
                    className='delete-item-button'
                    onClick={()=>handleDelete()}
                >
                ✖
                </div>
            </div>
        </div>
        </>
    );
}

export default CartSliderItemCard;
