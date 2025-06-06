import { useState, useEffect } from "react";


import { useSelector } from 'react-redux'; // reads values from store states and subscribes states to updates

import './CartPage.css';

import CartPageItemCard from "../../PageComponents/cartPageItemCard/cartPageItemCard.jsx";
import ShopNowButton from "../../PageComponents/cartShopNowButton/cartShopNowButton.jsx";

const CartPage = () => { /* Fallback Cart Page outside of main 'Slider Cart' */

    const cartProducts = useSelector((state) => state.cart.products); // allows extraction and usage of 'products' from cart reducer store

    const [totalQuantity, setTotalQuantity] = useState(null);
    const [subTotal, setSubTotal]           = useState(null);

    const getTotalQuantity = () => { /* Get total quanity of products in cart */
        const quantity = cartProducts.reduce(          // 1st: use reduce() to get sum of quantities
        (totalItemsInCart, cartProduct) =>             // 2nd: define accumulator ('totalItemsInCart') and product (each 'item' in products)
            (totalItemsInCart + cartProduct.quantity), // 3rd: add each product's quanity to accumulator 
        0.00);                                         // 4th: initial value of accumulator/sum

        setTotalQuantity(quantity);
    };

    const getSubTotalCost = () => {
        const subTotalCost = cartProducts.reduce(
        (subTotal, cartProduct) => (subTotal + parseFloat(cartProduct.totalPrice)),
        0);

        setSubTotal(subTotalCost.toFixed(2));
    }

    useEffect(() => {
        getTotalQuantity();
        getSubTotalCost();
    },[cartProducts])

    return (
        <>
        <div className="cart-page-content">
            {/* Add cart header */}
            <div className="cart-page-header">
              { (cartProducts && cartProducts.length>0) ?
                (`Your Cart (${totalQuantity})`):
                (<span id='empty-cart-page-notice'>Your Cart is Empty</span>)
              }
            </div>
            <div className="cart-page-items-wrapper">
              <div className="cart-page-items">
                { (cartProducts && cartProducts.length>0) 
                  ? (
                  cartProducts.map((cartProduct) => ( // populate product cards based on products [] in cart state
                    <CartPageItemCard product={cartProduct} key={cartProduct.productId} />
                  ))
                  ):(
                    <ShopNowButton />
                  )
                }
              </div>
            </div>
            {/* "Initial" Order Summary in Cart (slider) */}
            <div className='cart-page-order-summary'>
              <div id='cart-page-order-summary-header'>Order Summary</div>
              <div className='cart-page-label-and-value'>
                <div id='cart-page-label'>Subtotal: </div>
                <div id='cart-page-value'>${subTotal}</div>
              </div> 
              <div className='cart-page-label-and-value'>
                <div id='cart-page-label'>Shipping: </div>
                <div id='cart-page-value'>Calculated at checkout</div>
              </div> 
              <div className='cart-page-label-and-value'>
                <div id='cart-page-label'>Estimated Tax: </div>
                <div id='cart-page-value'>Calculated at checkout</div>
              </div> 
            </div>
          </div>
        </>
    );
}

export default CartPage;