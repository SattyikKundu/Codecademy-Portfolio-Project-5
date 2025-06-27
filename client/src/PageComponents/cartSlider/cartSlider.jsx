import { useState, useEffect } from "react";

import "./cartSlider.css";

import { useSelector } from 'react-redux';  // reads values from store states and subscribes states to updates

import CartSilderItemCard from "../cartSliderItemCard/cartSliderItemCard";
import ShopNowButton      from "../cartShopNowButton/cartShopNowButton";
import CartCheckOutButton from "../cartCheckoutButton/cartCheckoutButton";

const CartSlider = ({cartSliderOpen, toggleCart}) => { // cart slider shows when user clicks on cart button

  const products = useSelector((state) => state.cart.products); // allows extraction and usage of 'products' from cart reducer store

  const [totalQuantity, setTotalQuantity] = useState(null);
  const [subTotal, setSubTotal]           = useState(null);

  const getTotalQuantity = () => { /* Get total quanity of products in cart */
    const quantity = products.reduce(          // 1st: use reduce() to get sum of quantities
      (totalItemsInCart, product) =>           // 2nd: define accumulator ('totalItemsInCart') and product (each 'item' in products)
        (totalItemsInCart + product.quantity), // 3rd: add each product's quanity to accumulator 
      0.00);                                   // 4th: initial value of accumulator/sum

    setTotalQuantity(quantity);
  };

  const getSubTotalCost = () => { /* Get total subcosts of product in cart via reducer */
    const subTotalCost = products.reduce(
      (subTotal, product) => (subTotal + parseFloat(product.totalPrice)),
      0);

    setSubTotal(subTotalCost.toFixed(2));
  }

  useEffect(() => { /* Update total quantity and total subcost when 'products' change */
    getTotalQuantity();
    getSubTotalCost();
  },[products])

  return (
      <>
        {/* Below is cart that open/closes when menu cart button is pressed */}
        <div className={`cart-slider-wrapper ${cartSliderOpen && 'open'}`}>
          <div className="cart-slider-content">
            {/* Add cart header */}
            <div className="cart-header">
              { (products && products.length>0) ?
                (`Your Cart (${totalQuantity})`):
                (<span id='empty-cart-notice'>Your Cart is Empty</span>)
              }
            </div>
            {/* Add close cart slider */}
            <button className="close-cart" onClick={toggleCart}>
              Close <span>🗙</span>
            </button>
            <div className="cart-items-wrapper">
              <div className="cart-items">
                { (products && products.length>0) ? 
                  (products.map((product) => ( // populate product cards based on products [] in cart state                    
                    <CartSilderItemCard product={product} key={product.productId} />
                  ))
                  ):(
                    <ShopNowButton toggleCart={toggleCart} />
                  )
                }
              </div>
            </div>
            {/* "Initial" Order Summary in Cart (slider) */}
            <div className='order-summary'>
              <div id='order-summary-header'>Order Summary</div>
              <div className='label-and-value'>
                <div id='label'>Subtotal: </div>
                <div id='value'>${subTotal}</div>
              </div> 
              <div className='label-and-value'>
                <div id='label'>Shipping: </div>
                <div id='value'>Calculated at checkout</div>
              </div> 
              <div className='label-and-value'>
                <div id='label'>Estimated Tax: </div>
                <div id='value'>Calculated at checkout</div>
              </div> 
            </div>
            <CartCheckOutButton toggleCart={toggleCart}/>
          </div>
        </div>

        {/* Overlay that shows when cart is opened */}
        <div className={`cart-slider-overlay ${cartSliderOpen && 'active'}`}></div>
      </>
    )
};

export default CartSlider;
