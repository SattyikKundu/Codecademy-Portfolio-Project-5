
import "./cartSlider.css";

const CartSlider = ({cartSliderOpen, toggleCart}) => { // cart slider shows when user clicks on cart button

  return (
      <>
        {/* Below is cart that open/closes when menu cart button is pressed */}
        <div className={`cart-slider-wrapper ${cartSliderOpen && 'open'}`}>
          <div className="cart-slider-content">
            <div className="cart-items">
              Cart items be added...
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
