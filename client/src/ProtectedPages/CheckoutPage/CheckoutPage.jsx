import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {groupedStateOptions} from '../../utils/statesOfAmericaData';

import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import {faCircleArrowLeft, faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';


/* Created Page components imported */
import CheckoutCartFinal from '../../PageComponents/checkoutCartFinal/checkoutCartFinal';
import CheckoutStateDropDown from '../../PageComponents/checkoutStateDropDown/checkoutStateDropDown';
import CheckoutPaymentSection from '../../PageComponents/checkoutPaymentSection/checkoutPaymentSection';

import { lowShippingCostStates, highShippingCostStates } from '../../utils/statesOfAmericaData';

import './CheckoutPage.css'; // for stying

const CheckoutPage = () => {

    const navigate = useNavigate(); // used for navigation buttons

    const cartProducts = useSelector((state) => state.cart.products);

    const [cartQuantity,   setCartQuantity] = useState(null);
    const [cartSubTotal,   setCartSubtotal] = useState(0.00);
    const [shippingCost,   setShippingCost] = useState(0.00);
    const [salesTax,           setSalesTax] = useState(0.00);
    const [orderTotal,       setOrderTotal] = useState(0.00);
    const [selectedState, setSelectedState] = useState('');

    const navigateBack = () => { // navigate to previous page (or '/products' as fallback)
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/products");
      }
    }

    const contShopping = () => { // navigate to '/products' for shopping
      navigate("/products");
    }


    useEffect(() => { // when selected state changes, update shipping cost calculation   
      const shippingCalc = (state) => {
        if (highShippingCostStates.includes(state)) {
            setShippingCost(15.00);
        }
        else if (lowShippingCostStates.includes(state)) {
          setShippingCost(8.00);
        }
        else { // if null/empty choice, set shipping to 0.00
          setShippingCost(0.00);
        }
      }
      shippingCalc(selectedState);
    },[selectedState]);

    useEffect(()=> { // calculate sales tax in response to changing cart subtotal
      const salesTaxCalc = (subTotal) => {
        const tax = (subTotal * 0.06); // .toFixed() turns number to string, use parseFloat next
        setSalesTax(tax);
      }
      salesTaxCalc(cartSubTotal);
    },[cartSubTotal]);

    useEffect(() => { // returns full order total based on all 3 dependencies
      console.log('Subtotal is: ',cartSubTotal);
      const orderTotalCalc = (subTotal, shipping, sales) => {
        const total = parseFloat(subTotal) + parseFloat(shipping) + parseFloat(sales);
        setOrderTotal(total);
      }
      orderTotalCalc(cartSubTotal, shippingCost, salesTax);
    },[cartSubTotal, shippingCost, salesTax]);


    return (
      <>
      {/* Empty header box to close up the blank/white-space on top */}
      <div className='empty-header-box'>.</div>

      {/* Header link to navigate back to previous page */}
      <div className='prev-page-buttons-header'>
        <div id='prev-page' onClick={navigateBack}>
          <FontAwesomeIcon icon={faCircleArrowLeft} /> Previous Page 
        </div> 
        <FontAwesomeIcon icon={faGripLinesVertical} />
        <div id='cont-shop' onClick={contShopping}>Continue Shopping?</div> 
      </div>

      {/* Page title header */}
      <div className='page-title'>SECURE CHECKOUT</div>

      {/* Section 1: Final Cart at Checkout */}
      <div className='checkout-cart-container'>
        <div className='checkout-cart-header'>1. REVIEW YOUR ORDER ({cartQuantity} items)</div>
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

        <div className='checkout-divider' id='div3' />

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
            <CheckoutStateDropDown options={groupedStateOptions} value={selectedState} onSelect={setSelectedState} />
          </div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Postal/ZIP Code*</div>
          <div className='checkout-input'><input type='text' name='postal-code' maxlength='255' required/></div>
        </div>
        {/* using htmlFor connect label to input (can now click on label to toggle checkbox) */}
        <div className='update-profile-data'>
            <input type='checkbox' name='update-profile' id='updateProfileCheckbox'/>
             <label htmlFor='updateProfileCheckbox'>Save Delivery/Home Address to Your Profile</label>
        </div>
      </div>

      {/* Section 3: Order summary */}
      <div className='checkout-order-summary-container'>
        <div className='checkout-order-summary-header'>3. ORDER SUMMARY</div>
        <div className='checkout-divider' id='div3' />
        <div className='checkout-order-summary'>
          <div className='checkout-subtotal'>
            <div id='checkout-subtotal-label'>Subtotal</div>
            <div id='checkout-subtotal-field'>${cartSubTotal}</div>
          </div>
          <div className='checkout-shipping-cost'>
            <div id='checkout-shipping-cost-label'>Shipping Cost</div>
            <div id='checkout-shipping-cost-field'>${shippingCost.toFixed(2)}</div>
          </div>
          <div className='checkout-sales-tax'>
            <div id='checkout-sales-tax-label'>Sales Tax</div>
            <div id='checkout-sales-tax-field'>${salesTax.toFixed(2)}</div>
          </div>
          <div className='checkout-order-total'>
            <div id='checkout-order-total-label'>Order Total</div>
            <div id='checkout-order-total-field'>${orderTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Section 4: Payment Method (imported component) */}
      <CheckoutPaymentSection 
        orderTotal={orderTotal} 
        disableButton={
          ((shippingCost && shippingCost>0) && (cartSubTotal && cartSubTotal>0)) ? false: true
        }
        />
      </>
    );
}

export default CheckoutPage;
