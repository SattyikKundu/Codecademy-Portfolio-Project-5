import { 
         useDispatch, // hook used to dispatch a slice/reducer's actions
         useSelector  // reads values from store states and subscribes states to updates
        } from 'react-redux';


import { increaseByOne, 
         decreaseByOne,
         deleteFromCart,
         selectProductQuantityById // selector method for finding products current quantity in cart
        } from '../../Slices/cartSlice.jsx';

import './cartItemCard.css';



const cartItemCard = ({product}) => {

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
        <div className="cart-item-wrapper">
            <div className="cart-item-content">

                {/* Holds product image for visual reference */}
                <div className='cart-item-img-wrapper'>
                    <img src={imageFilePath} alt={name} className='cart-item-image' />
                </div>

                {/* Hold cart item info as well as increase/decrease item quantity buttons */ }
                <div className='cart-item-info-buttons'>
                    <div className='cart-item-info'>
                        <div id='cart-item-name'>{name}</div>
                        <div id='cart-item-price-total'>${totalPrice}</div>
                        <div id='cart-item-price-each'>${unitPrice}/item</div>
                    </div>
                    <div className='cart-item-buttons'>
                        <div 
                            className={`decrease-by-one ${(quantity <= 1) 
                                        ? "disable-decrease" 
                                        : "" }`
                                      }
                            onClick={()=>handleDecrease()}
                        >–</div>
                        <div className='cart-quantity'>{quantity}</div>
                        <div 
                            className={`increase-by-one ${(quantity >= quantityLimit) 
                                        ? "disable-increase" 
                                        : "" }`
                                      }
                            onClick={()=>handleIncrease()}
                        >+</div>
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

export default cartItemCard;
