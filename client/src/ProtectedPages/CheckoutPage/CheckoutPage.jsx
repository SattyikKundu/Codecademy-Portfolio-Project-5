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
      {/* Empty block to let background color/img stretch to top */}
      <div className='empty-header'>empty-header-block</div>

      {/* Page title header */}
      <div className='page-title'>SECURE CHECKOUT</div>

      {/* Section 1: Final Cart at Checkout */}
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
      </div>

      {/* Section 2: Delivery/Home Address Fillout at Checkout */}
      <div className='checkout-address-container'>
        <div className='checkout-address-header'>2. DELIVERY ADDRESS</div>

        <div className='checkout-divider' id='div1' />

        <div className='required-fields-notice'>
          <div id='notice-label'>All required fields*</div>
          <div id='upload-profile-data'><button>Upload Existing Data from Profile</button></div>
        </div>

        {/* Various input fields necessary for shipping/delivery */}
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Email Address*</div>
          <div className='checkout-input'><input type="email" name="email" maxLength='255' required/></div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>First Name*</div>
          <div className='checkout-input'><input type='text' name='firstname' maxLength='255' required /></div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Last Name*</div>
          <div className='checkout-input'><input type='text' name='lastname' maxLength='255' required /></div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Phone Number*</div>
          <div className='checkout-input'><input type='tel' name='phone' maxLength='255' required /></div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Home/Shipping Address*</div>
          <div className='checkout-input'><input type='text' name='address-main' required /></div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Apartment, suite, unit, etc. (optional)</div>
          <div className='checkout-input'><input type='text' name='address-optional' maxLength='255' /></div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>City*</div>
          <div className='checkout-input'><input type='text' name='city' maxLength='255' required/></div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>U.S. State/Territory*</div>
          <div className='checkout-input' id='state-dropdown-input'>
            <CheckoutStateDropDown options={groupedStateOptions} value={selectedSet} onSelect={setSelectedState} />
          </div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Postal/ZIP Code*</div>
          <div className='checkout-input'><input type='text' name='postal-code' maxlength='255' required/></div>
        </div>
        <div className='update-profile-data'>
            <input type='checkbox' name='update-profile' />
             <label>Save Delivery/Home Address to Profile</label>
        </div>
      </div>

      {/* Section 3: Order summary, VISA payment, and submit button */}
      <div className='checkout-order-summary-payment-container'>

        <div className='checkout-order-summary-payment-header'>3. ORDER SUMMARY & PAYMENT</div>

        <div className='checkout-divider' id='div1' />

        <div className='checkout-order-summary-header'>Order Summary</div>
        <div className='checkout-order-summary'>
          <div className='checkout-subtotal'>
           <div id='checkout-subtotal-label'>Subtotal</div>
           <div id='checkout-subtotal-field'>${cartSubTotal}</div>
          </div>


        </div>

      </div>
      </>
    );
}

export default CheckoutPage;
