import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {groupedStateOptions, lowShippingCostStates, highShippingCostStates} from '../../utils/statesOfAmericaData';

import { isValidUSPhone, 
        normalizeUSPhone, 
        isValidZipCode,
        setupOutsideClickToClearInvalidFields, 
        validateField} from './checkoutHelpers';

import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import {faCircleArrowLeft, faGripLinesVertical } from '@fortawesome/free-solid-svg-icons';

import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';

import axios from 'axios';

import { ErrorMessageToast } from "../../utils/utilityFunctions";

/* Created Page components imported */
import CheckoutCartFinal from '../../PageComponents/checkoutCartFinal/checkoutCartFinal';
import CheckoutStateDropDown from '../../PageComponents/checkoutStateDropDown/checkoutStateDropDown';
import CheckoutPaymentSection from '../../PageComponents/checkoutPaymentSection/checkoutPaymentSection';


import './CheckoutPage.css'; // for stying

const CheckoutPage = () => {

  const navigate = useNavigate(); // used for navigation buttons

  const stripe = useStripe(); // Needed to process 'fake' Stripe payment
  const elements = useElements();

  const authUser = useSelector((state) => state.auth.user); // gets user's authentication to get email
  const cartProducts = useSelector((state) => state.cart.products); // gets user's cart stored in redux
  const [cartQuantity,   setCartQuantity] = useState(null);        // track total quanitity of cart items

  /* Tracks Order total (and its subcosts) */
  const [cartSubTotal,   setCartSubtotal] = useState(0.00); // tracks cart subtotal
  const [shippingCost,   setShippingCost] = useState(0.00); // tracks shipping cost
  const [salesTax,           setSalesTax] = useState(0.00); // tracks sales tax
  const [orderTotal,       setOrderTotal] = useState(0.00); // tracks total costs on checkout

  /* Tracking of fields' values in the delivery/home address form */
  const [email, setEmail] = useState(authUser?.email || ''); // use for email auto fillout (or null)
  const [firstName,         setFirstName] = useState('');
  const [lastName,           setLastName] = useState('');
  const [phoneNumber,     setPhoneNumber] = useState('');
  const [addressLine1,   setAddressLine1] = useState('');
  const [addressLine2,   setAddressLine2] = useState('');
  const [city,                   setCity] = useState('');
  const [selectedState, setSelectedState] = useState('');  // tracks value of state dropdown menu
  const [postalCode,       setPostalCode] = useState('');  // NEW: Moved to main page for form scope

  const [profileUploading, setProfileUploading] = useState(false); // tracks loading state of user profile being uploaded to

  /* Tracking for checkout validation and error handling */
  const [formSubmitting, setFormSubmitting] = useState(false); // tracks start/end of checkout submission
  const [paymentError,     setPaymentError] = useState('');
  const [clientSecret,     setClientSecret] = useState(null);

  // Stripe field validation states
  const [cardHasError,     setCardHasError] = useState(false); // tracks if card number has error or not
  const [cardComplete,     setCardComplete] = useState(false); // tracks if card number if complete
  const [cardBorder,         setCardBorder] = useState(false); // toggles '.invalid-field' for card number field

  const [expiryHasError, setExpiryHasError] = useState(false); // tracks if expiry date has error or not
  const [expiryComplete, setExpiryComplete] = useState(false); // tracks if expiry date is complete
  const [expiryBorder,     setExpiryBorder] = useState(false); // toggles '.invalid-field' for expiry field

  const [cvcHasError,       setCvcHasError] = useState(false); // tracks if cvc number has error or not
  const [cvcComplete,       setCvcComplete] = useState(false); // tracks if cvc number is complete
  const [cvcBorder,           setCvcBorder] = useState(false); // toggles '.invalid-field' for expiry field

  const props = {
    postalCode,   setPostalCode,
    cardHasError, setCardHasError, expiryHasError, setExpiryHasError, cvcHasError, setCvcHasError,
    cardComplete, setCardComplete, expiryComplete, setExpiryComplete, cvcComplete, setCvcComplete,
    cardBorder,   setCardBorder,   expiryBorder,   setExpiryBorder,   cvcBorder,   setCvcBorder
  };

  const disableButton = !(cartQuantity>0 && cartSubTotal>0); // toggles submit button as active/disabled

  const [saveToProfile, setSaveToProfile] = useState(false); // tracks checkbox for uploading delivery/address data 
                                                             // as updated value to user profile data.

  /*************************************************************************************************************/
  /********************* useEffects for updating order total costs and subcosts ********************************/
  /*************************************************************************************************************/

  useEffect(() => { // when selected state changes, update shipping cost calculation   
    if (highShippingCostStates.includes(selectedState)) { setShippingCost(15.00);}
    else if (lowShippingCostStates.includes(selectedState)) {setShippingCost(8.00);}
    else { setShippingCost(0.00);} // if null/empty choice, set shipping to 0.00
  },[selectedState]);

  useEffect(()=> { // calculate sales tax in response to changing cart subtotal
      setSalesTax(cartSubTotal * 0.06);
  },[cartSubTotal]);

  useEffect(() => { // returns full order total based on all 3 dependencies
      const total = parseFloat(cartSubTotal) + parseFloat(shippingCost) + parseFloat(salesTax);
      setOrderTotal(total);
  },[cartSubTotal, shippingCost, salesTax]);

  useEffect(() => {
    const cleanup = setupOutsideClickToClearInvalidFields();
    return cleanup; // remove event listener on unmount
  }, []);

  /*************************************************************************************************************/
  /********************* Checkout page's navigation functions **************************************************/
  /*************************************************************************************************************/

  const navigateBack = () => { // navigate to previous page (or '/products' as fallback)
    if (window.history.length > 1) { navigate(-1);} 
    else { navigate("/products"); }
  }

  const contShopping = () => { // navigate to '/products' for shopping
    navigate("/products");
  }

  /*************************************************************************************************************/
  /********************* Checkout page's form validation methods ***********************************************/
  /*************************************************************************************************************/

    const validateFormFields = () => { // programatically validates each address field in order from first to last

    /* Will consider adding a validator for email at a later date */
    if (!validateField({ value: email, message: 'Email is required.', selector: 'input[name="email"]'})){
      return false;
    } 
    if (!validateField({ value: firstName, message: 'First name is required.', selector: 'input[name="firstname"]'})){
      return false;
    } 
    if (!validateField({ value: lastName, message: 'Last name is required.', selector: 'input[name="lastname"]'})){
       return false;
    }
    if (!validateField({ value: phoneNumber, 
        message: 'Phone number is invalid or missing.\n(Format: XXX-XXX-XXXX)',
        selector: 'input[name="phone"]',  validator: isValidUSPhone,  offset: 126})) {
      return false;
    } 
    if (!validateField({ value: addressLine1, 
        message: 'Shipping/Home address is required.', 
        selector: 'input[name="address-main"]' })) {
      return false;
    } 
    if (!validateField({ value: city, 
        message: 'City is required.', selector: 'input[name="city"]'})) {
      return false;
    } 
    if (!validateField({ value: selectedState, 
        message: 'Select a U.S. state or territory.\nNeeded for Shipping Costs.',
        selector: '#state-dropdown-menu-box', offset: 126 })) {
      return false;
    } 

    if (!validateField({ value: postalCode, 
        message: 'Postal code is missing or invalid.\n(Format: XXXXX or XXXXX-XXXX)',
        selector: '.postal-code-field', validator: isValidZipCode,  offset: 126 })) {
      return false;
    } 
    return true; // if ALL field value valid, return true (needed for submission)
  };


  const validateStripeFields = () => { // programmatically validates EACH payment field
    if (!cardComplete || cardHasError) {
      setCardBorder(true);
      ErrorMessageToast('Card number is incomplete or invalid.', 2500);
      return false;
    }
    if (!expiryComplete || expiryHasError) {
      setExpiryBorder(true);
      ErrorMessageToast('Expiry date is incomplete or invalid.', 2500);
      return false;
    }
    if (!cvcComplete || cvcHasError) {
      setCvcBorder(true);
      ErrorMessageToast('CVC is incomplete or invalid.', 2500);
      return false;
    }
    return true; // if all payment fields valid, return true
  };


  /*************************************************************************************************************/
  /********** Checkout page's profile upload button and submission handling functions **************************/
  /*************************************************************************************************************/

  const loadProfileData = async () => { // get use to load existing profile data 
                                        // to section #2 address/delivery form
    setProfileUploading(true);
    try {
        const res = await axios.get('http://localhost:5000/profile', { withCredentials: true});

        const user = res.data.user;
         // Helper to set value + remove red border if input is valid
        const setFieldAndClearError = (setFn, val, selector) => {
          setFn(val);
          const el = document.querySelector(selector);
          if (el && val.trim()) el.classList.remove('invalid-field');
        };

        setFieldAndClearError(setEmail,        user.email         || '', 'input[name="email"]');
        setFieldAndClearError(setFirstName,    user.first_name    || '', 'input[name="firstname"]');
        setFieldAndClearError(setLastName,     user.last_name     || '', 'input[name="lastname"]');
        setFieldAndClearError(setPhoneNumber,  user.phone_number  || '', 'input[name="phone"]');
        setFieldAndClearError(setAddressLine1, user.address_line1 || '', 'input[name="address-main"]');
        setFieldAndClearError(setAddressLine2, user.address_line2 || '', 'input[name="address-optional"]');
        setFieldAndClearError(setCity,         user.city          || '', 'input[name="city"]');
        setFieldAndClearError(setPostalCode,   user.postal_code   || '', '.postal-code-field');

        setSelectedState(user.state || '');
        const stateEl = document.querySelector('#state-dropdown-menu-box');
        if (stateEl && user.state) stateEl.classList.remove('invalid-field');

        // resets Stripe card error/completion states
        setCardHasError(false);
        setCardComplete(false);
        setExpiryHasError(false);
        setExpiryComplete(false);
        setCvcHasError(null);
        setCvcComplete(false);

        // Clear any existing red borders after loading profile data
        document.querySelectorAll('.invalid-field').forEach((element) => {
          element.classList.remove('invalid-field');
        });
    } 
    catch (error) {
      ErrorMessageToast(`Failed to load Profile data:\n`,error);
      setProfileUploading(false);
    }
    finally {
      setProfileUploading(false);
    }
  };


  const initiateCheckout = async () => { // execute checkout route in backend
    try {
      const response = await axios.post('http://localhost:5000/checkout', {
        cartItems: cartProducts, // save 'cartProducts' as 'cartItems'
        deliveryInfo: {
          email,
          firstName,
          lastName,
          phoneNumber: normalizeUSPhone(phoneNumber),
          addressLine1,
          addressLine2,
          city,
          state: selectedState,
          postalCode
        },
        cartTotals: {
          subTotal: cartSubTotal,
          shippingCost,
          taxAmount: salesTax,
          total: orderTotal
        },
        saveAddressToProfile: saveToProfile
      }, 
      { withCredentials: true }
    );

      console.log('client Secret: ', response.data.clientSecret);
      return response.data.clientSecret;
    } 
    catch (error) {
      console.error("Checkout initiation failed: ", error);
      throw new Error("Checkout initiation failed.");
    }
  };



  const confirmStripePayment = async (clientSecret) => { // 'Stripe' payment function

    if (!stripe || !elements) {
      throw new Error("Stripe not properly loaded.");
    }

    const cardElement = elements.getElement(CardNumberElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          email, 
          name: `${firstName} ${lastName}`, 
          phone: phoneNumber,
          address: {
            line1: addressLine1,
            line2: addressLine2 || '',
            city,
            state: selectedState,
            postal_code: postalCode,
          }
        }
      }
    });

    return result;
  };


  const handleSubmit = async (event) => {

    event.preventDefault(); // prevents page/component reload on submission
    setFormSubmitting(true);

    if (!validateFormFields()) { // if invalid form fields, cancel submission
      setFormSubmitting(false);
      return;
    }
    if (!validateStripeFields()) { // if invalid stripe fields, cancel submission
      setFormSubmitting(false);
      return;
    }

    try {
      const clientSecret = await initiateCheckout();
      setClientSecret(clientSecret);

      const paymentResult = await confirmStripePayment(clientSecret);

      if (paymentResult.error) {
        setPaymentError(paymentResult.error.message);

        const cardElement = elements.getElement(CardNumberElement);
        cardElement?.focus(); // Scrolls to card input

        ErrorMessageToast(`Payment Error: ${paymentResult.error.message}`);
      } 
      else if (paymentResult.paymentIntent.status === 'succeeded') {
        navigate('/profile'); // Navigate to profile for time being
      }
    } 
    catch (error) {
      setPaymentError("An error occurred during checkout: ", error);
    } 
    finally {
      setFormSubmitting(false);

    }
  };


  return (
    <>
    {/* Empty header box to close up the blank/white-space on top */}
    <div className='empty-header-box'>''</div>

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

    <form onSubmit={handleSubmit}>
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
          <div id='upload-profile-data'>
            <button 
              type="button"  // needed to prevent form resubmissions so loadProfileData() will work
              onClick={loadProfileData}
              disabled={profileUploading}// button disabled when loading profile
            >{ !profileUploading ? 'Upload Existing Data from Profile' : '...Loading Profile...'}</button>
          </div>
        </div>

        {/* Various input fields necessary for shipping/delivery */}
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Email Address*</div>
          <div className='checkout-input'>
            <input 
              type="email" 
              name="email" 
              maxLength='255' 
              value={email} 
              onChange={(event) => {
                setEmail(event.target.value);
                event.target.classList.remove('invalid-field');
              }} 
            />  
          </div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>First Name*</div>
          <div className='checkout-input'>
            <input 
              type='text' 
              name='firstname' 
              maxLength='255' 
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
                event.target.classList.remove('invalid-field');
              }} 
            />
          </div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Last Name*</div>
          <div className='checkout-input'>
            <input 
              type='text' 
              name='lastname' 
              maxLength='255' 
              value={lastName}  
              onChange={(event) => {
                setLastName(event.target.value);
                event.target.classList.remove('invalid-field');
              }} 
            />
          </div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Phone Number*</div>
          <div className='checkout-input'>
            <input 
              type='tel' 
              name='phone' 
              maxLength='255'
              value={phoneNumber}
              onChange={(event) => {
                setPhoneNumber(event.target.value);
                event.target.classList.remove('invalid-field');
              }} 
            />
          </div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Home/Shipping Address*</div>
          <div className='checkout-input'>
            <input 
              type='text' 
              name='address-main' 
              value={addressLine1}
              onChange={(event) => {
                setAddressLine1(event.target.value);
                event.target.classList.remove('invalid-field');
              }}
            />
          </div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Apartment, suite, unit, etc. (optional)</div>
          <div className='checkout-input'>
            <input 
              type='text' 
              name='address-optional' 
              maxLength='255' 
              value={addressLine2}
              onChange={(event) => {
                setAddressLine2(event.target.value);
                event.target.classList.remove('invalid-field');
              }} 
            />
          </div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>City*</div>
          <div className='checkout-input'>
            <input 
              type='text' 
              name='city' 
              maxLength='255' 
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
                event.target.classList.remove('invalid-field');
              }} 
            />
          </div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>U.S. State/Territory*</div>
          <div className='checkout-input' id='state-dropdown-input'>
            <CheckoutStateDropDown 
              options={groupedStateOptions} 
              selectedOption={selectedState} 
              onSelect={setSelectedState} 
            />
          </div>
        </div>
        <div className='checkout-label-and-input'>
          <div className='checkout-label'>Postal/ZIP Code*</div>
          <div className='checkout-input'>
            <input 
              type='text' 
              name='postal-code' 
              className='postal-code-field'
              maxLength='255' 
              value={postalCode}
              onChange={(event) => {
                setPostalCode(event.target.value)
                document.querySelectorAll('.postal-code-field').forEach((element) =>element.classList.remove('invalid-field'))
              }}
            />
          </div>
        </div>
        {/* using htmlFor connect label to input (can now click on label to toggle checkbox) */}
        <div className='update-profile-data'>
            <input 
              type='checkbox' 
              name='update-profile' 
              id='updateProfileCheckbox' 
              checked={saveToProfile}
              onChange={() => {setSaveToProfile(!saveToProfile)}}
            />
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

      {/* Section 4: Payment Method (imported component INSIDE wrapper) */}
      <div className='checkout-payment-container'>
        <CheckoutPaymentSection props={props}/>
        <div className='checkout-payment-submit'>
          <button type="submit" disabled={disableButton} >
            Pay ${orderTotal.toFixed(2)}
          </button>
        </div>
      </div>
    </form>
    </>
  );
}

export default CheckoutPage;


