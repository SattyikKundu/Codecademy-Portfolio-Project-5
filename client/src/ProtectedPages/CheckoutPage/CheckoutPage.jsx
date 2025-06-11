/** Checkout Page component **/

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {groupedStateOptions} from '../../utils/statesOfAmericaData';

import './CheckoutPage.css'; // for stying

import CheckoutCartFinal from '../../PageComponents/checkoutCartFinal/checkoutCartFinal';
import CheckoutStateDropDown from '../../PageComponents/checkoutStateDropDown/checkoutStateDropDown';

const CheckoutPage = () => {

    const dispatch = useDispatch();
    const cartProducts = useSelector((state) => state.cart.products);
    const [cartQuantity, setCartQuantity] = useState(null);
    const [cartSubTotal, setCartSubtotal] = useState(0.00);


    const [selectedSet, setSelectedState] = useState('');

    return (
      <>
      <div className='empty-header'>empty-header-block</div>
      
      <div className='page-title'>SECURE CHECKOUT</div>

      <div className='checkout-cart-container'>
        <div className='checkout-cart-header'>
            1. REVIEW YOUR ORDER ({cartQuantity} items)
        </div>
        <div className='checkout-divider' id='div1' />
         <CheckoutCartFinal 
            cartProducts={cartProducts} 
            setCartQuantity={setCartQuantity} 
            setCartSubtotal={setCartSubtotal}
        />
        <div className='checkout-divider' id='div2' />
        <div className='checkout-cart-subtotal'>
          <div id='checkout-cart-label'>Subtotal: </div>
          <div id='checkout-cart-value'>${cartSubTotal}</div>
        </div> 
        <div className='checkout-cart-shipping'>
          <div id='checkout-cart-label'>Shipping To (U.S. state): </div>
          <div id='checkout-cart-value'>
            <CheckoutStateDropDown
              value={selectedSet}
              onSelect={setSelectedState}
              options={groupedStateOptions} 
            />
          </div>
        </div> 
      </div>
      <div className='checkout-address-container'>

      </div>
      </>
    );
}

export default CheckoutPage;
