import { 
         useDispatch, // hook used to dispatch a slice/reducer's actions
         useSelector  // reads values from store states and subscribes states to updates
        } from 'react-redux';


import { increaseByOne, 
         decreaseByOne,
         deleteFromCart,
         selectProductQuantityById // selector method for finding products current quantity in cart
        } from '../../Slices/cartSlice.jsx';

//import { motion, AnimatePresence } from 'framer-motion'; // used to animate cart item cards as they're added/removed from cart

import './cartSliderItemCard.css';


const CartSliderItemCard = ({product}) => {

    const {  // props needed for cartItem card
        productId,  
        imageFilePath, 
        name, 
        quantity, 
        unitPrice, 
        totalPrice, 
        quantityLimit
    } = product;

    const dispatch = useDispatch();  // initilize dispatch to use 'cart' reducer methods
    
    const handleIncrease = () => {
        if(quantity < quantityLimit) {
            dispatch(increaseByOne({productId}));
        }
    }

    const handleDecrease = () => {
        if (quantity > 1) {
            dispatch(decreaseByOne({productId}));
        }
    }

    const handleDelete = () => {
        dispatch(deleteFromCart({productId})); //?? revie later...
    }

    return (
        <>
        <div className="cart-slider-item-wrapper">
            <div className="cart-slider-item-content">

                {/* Holds product image for visual reference */}
                <div className='cart-slider-item-img-wrapper'>
                    <img src={imageFilePath} alt={name} className='cart-slider-item-image' />
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
