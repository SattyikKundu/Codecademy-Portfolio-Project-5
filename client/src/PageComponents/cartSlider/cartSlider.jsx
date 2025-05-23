
import "./cartSlider.css";

import { 
         useDispatch, // hook used to dispatch a slice/reducer's actions
         useSelector  // reads values from store states and subscribes states to updates
        } from 'react-redux';

import CartItemCard from "../cartItemCard/cartItemCard";

const CartSlider = ({cartSliderOpen, toggleCart}) => { // cart slider shows when user clicks on cart button

  const dispatch = useDispatch();  // initilize dispatch to use 'cart' reducer methods
  const products = useSelector((state) => state.cart.products);

  return (
      <>
        {/* Below is cart that open/closes when menu cart button is pressed */}
        <div className={`cart-slider-wrapper ${cartSliderOpen && 'open'}`}>
          <div className="cart-slider-content">
            <div className="cart-items">
              { (products && products.length>0) ? 
                (
                 products.map((product) => ( // populate product cards based on products [] in cart state
                  <CartItemCard product={product} key={product.productId} />
                 ))
                ):(
                  <h1>Cart is Empty. Shop to Add Products....</h1>
                )
              }
            </div>
            <div className="cart-checkout-button-wrapper">
              Button be added...
            </div>
            <button className="close-cart" onClick={toggleCart}>
              🗙
            </button>
          </div>
        </div>

        {/* Overlay that shows when cart is opened */}
        <div className={`cart-slider-overlay ${cartSliderOpen && 'active'}`}></div>
      </>
    )
};

export default CartSlider;
