import { 
         useDispatch, // hook used to dispatch a slice/reducer's actions
         useSelector  // reads values from store states and subscribes states to updates
        } from 'react-redux';


import { increaseByOne, 
         decreaseByOne,
         deleteFromCart,
         selectProductQuantityById // selector method for finding products current quantity in cart
        } from '../../Slices/cartSlice.jsx';

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
    
    const handleItemIncrease = () => {
        if(quantity < quantityLimit) {
            dispatch(increaseByOne({productId}));
        }
    }

    const handleItemDecrease = () => {
        if (quantity > 1) {
            dispatch(decreaseByOne({productId}));
        }
    }

    const handleItemDelete = () => {
        dispatch(deleteFromCart({productId})); //?? revie later...
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
