import { useState, useEffect } from "react";
//import { useSelector } from "react-redux";

import './checkoutCartFinal.css';

import ShopNowButton from "../cartShopNowButton/cartShopNowButton";
import CheckoutCartItemCard from "../checkoutCartItemCard/checkoutCartItemCard";

const CheckoutCartFinal = ({cartProducts, setCartQuantity, setCartSubtotal}) => { // contains "final" cart user cart as part of checkout (still editable)

  //const cartProducts = useSelector((state) => state.cart.products); // get current cart products to fill
                                                                    // final product list for checkout

  const [totalQuantity, setTotalQuantity] = useState(null);
  const [subTotal, setSubTotal]           = useState(null);

  const getTotalQuantity = () => { /* Get total quanity of products in cart */
    const quantity = cartProducts.reduce(          // 1st: use reduce() to get sum of quantities
      (totalItemsInCart, cartProduct) =>           // 2nd: define accumulator ('totalItemsInCart') and product (each 'item' in products)
        (totalItemsInCart + cartProduct.quantity), // 3rd: add each product's quanity to accumulator 
      0.00);                                       // 4th: initial value of accumulator/sum
        setTotalQuantity(quantity);
        setCartQuantity(quantity);
  };

  const getSubTotalCost = () => {
    const subTotalCost = cartProducts.reduce(
        (subTotal, cartProduct) => (subTotal + parseFloat(cartProduct.totalPrice)),
        0);

    setSubTotal(subTotalCost.toFixed(2));
    setCartSubtotal(subTotalCost.toFixed(2));
  }

  useEffect(() => {
    getTotalQuantity();
    getSubTotalCost();
  },[cartProducts])

  return (
    <>
    <div className="checkout-cart-container">
      {/*
      <div className="checkout-cartheader">
        { (cartProducts && cartProducts.length>0) ?
          (`Your Cart (${totalQuantity})`):
          (<span id='empty-checkout-cart-notice'>Your Cart is Empty</span>)
        }
      </div>*/}
      <div className="checkout-cart-items-wrapper">
        <div className="checkout-cart-items">
          {(cartProducts && cartProducts.length>0) ? 
           (
             cartProducts.map((cartProduct) => ( // populate product cards based on products [] in cart state
               <CheckoutCartItemCard product={cartProduct} key={cartProduct.productId} />
             ))
            ):(
               <ShopNowButton emptyCartMessage={'Need at least 1 product for checkout. Click to continue shopping...'}/>
            )
          }
        </div>
      </div>
    </div>
    </>
  );
}

export default CheckoutCartFinal;
