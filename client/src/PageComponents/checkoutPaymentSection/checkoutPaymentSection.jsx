import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements  } from '@stripe/react-stripe-js';

import './checkoutPaymentSection.css';

import {useEffect, useRef} from 'react';

const CheckoutPaymentSection = ({props}) => {

  /*************************************************************************************************************/
  /********************** Variables setup for component ********************************************************/
  /*************************************************************************************************************/

  const { // ALL (necessary) passed props for <CheckoutPaymentSection/>
    postalCode,      setPostalCode,
    setCardHasError, setExpiryHasError, setCvcHasError,
    setCardComplete, setExpiryComplete, setCvcComplete,
    cardBorder,      setCardBorder,   
    expiryBorder,    setExpiryBorder,   
    cvcBorder,       setCvcBorder
  } = props;

  /* useRef used to track clicking outside of Stripe/postal field elements */
  const cardRef   = useRef(null); 
  const expiryRef = useRef(null);
  const cvcRef    = useRef(null);

  const elements = useElements(); /* initalize to access Stripe elements to use .focus() on */

  /*************************************************************************************************************/
  /********************** useEffects (with functions) for desired side-effects *********************************/
  /*************************************************************************************************************/

  useEffect(() => { // use effect for removing red border if clicking outside field
    const handleClickOutsideStripeField = (event) => { // method to "turn off" .invalid-field class
      if(cardRef.current   && !cardRef.current.contains(event.target))   setCardBorder(false);  
      if(expiryRef.current && !expiryRef.current.contains(event.target)) setExpiryBorder(false);
      if(cvcRef.current    && !cvcRef.current.contains(event.target))    setCvcBorder(false);
    }
    document.addEventListener("mousedown", handleClickOutsideStripeField); // add method to event listener
    return () => document.removeEventListener("mousedown", handleClickOutsideStripeField); // clean up on unmount
    
  },[]);

  useEffect(() => { // focuses into Stripe input element when border is toggled on
    const focusStripeElement = () => {
      if(cardBorder){
        const cardElement = elements.getElement(CardNumberElement); // gets card element
        if (cardElement) cardElement.focus(); // if card element exists, focus into input
        return;                               // ends function (only 1 incomplete function at a time)
      }
      if (expiryBorder) {
        const expiryElement = elements.getElement(CardExpiryElement);    // gets card element
        if (expiryElement) expiryElement.focus(); // if card element exists, focus into input
        return;                                                               // end function
      }
      if (cvcBorder) {
        const cvcElement = elements.getElement(CardCvcElement);        // gets card element
        if (cvcElement) cvcElement.focus();     // if card element exists, focus into input
        return;                                                            // ends function
      }
    }
    focusStripeElement();
  },[cardBorder, expiryBorder, cvcBorder]);

  
  /*************************************************************************************************************/
  /**************************** Returned component below *******************************************************/
  /*************************************************************************************************************/

  return ( // Below are ALL 'Stripe' components' label and input fields
           // for the section container wrapper in the parent CheckoutPage component.
    <>
    {/* Payment Section (Section #4) Header title */}
    <div className='checkout-payment-header'>4. PAYMENT METHOD</div>
    <div className='checkout-divider' />

    {/* Stripe component — card number input and field label */}
    <div className='checkout-payment-label-and-input'>
      <div className='checkout-payment-label'>Card Number*</div>
      <div className={`checkout-payment-stripe-input ${cardBorder ? 'invalid-stripe-field' : ''}`} ref={cardRef}>
        <CardNumberElement
          options={{
            showIcon: true, // needed to show icon in field input
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#fa755a' },
            }
          }}
          onChange={(event) => {
            setCardBorder(false); // use to remove .invalid-field upon typing
            if (event.complete){  setCardComplete(true); }
            if (!event.complete){ setCardComplete(false);}
            if (!event.error){    setCardHasError(false);}
            if (event.error){     setCardHasError(true); }
          }}
        />
      </div>
    </div>

    {/* Stripe component — card expiration date input and field label */}
    <div className='checkout-payment-label-and-input'>
      <div className='checkout-payment-label'>Expiration Date*</div>
      <div className={`checkout-payment-stripe-input ${expiryBorder ? 'invalid-stripe-field' : ''}`} ref={expiryRef}>
        <CardExpiryElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#fa755a' },
            },
          }}
          onChange={(event) => {
            setExpiryBorder(false); // use to remove .invalid-field upon typing
            if (event.complete){  setExpiryComplete(true); }
            if (!event.complete){ setExpiryComplete(false);}
            if (!event.error){    setExpiryHasError(false);}
            if (event.error){     setExpiryHasError(true); }
          }}
        />
      </div>
    </div>

    {/* Stripe component — card's CVC number input and field label */}
    <div className='checkout-payment-label-and-input'>
      <div className='checkout-payment-label'>CVC*</div>
      <div className={`checkout-payment-stripe-input ${cvcBorder ? 'invalid-stripe-field' : ''}`} ref={cvcRef}>
        <CardCvcElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#fa755a'},
            },
          }}
          onChange={(event) => {
            setCvcBorder(false); // use to remove .invalid-field upon typing
            if (event.complete){  setCvcComplete(true); }
            if (!event.complete){ setCvcComplete(false);}
            if (!event.error){    setCvcHasError(false);}
            if (event.error){     setCvcHasError(true); }
          }}
        />
      </div>
    </div>

    {/* Postal field used for verfication purposes (controlled by parent page) */}
    <div className='checkout-payment-label-and-input'>
      <div className='checkout-payment-label'>Postal Code*</div>
      <div 
        className='checkout-payment-stripe-input postal-code-field'
        onClick={() => {document.getElementById('postal-code').focus()}}
      >
        <input
          type='text'
          name='postal-code'
          style={{backgroundColor: 'transparent'}}
          maxLength='10'
          value={postalCode}
          onChange={(event) => {
            setPostalCode(event.target.value); 
            document.querySelectorAll('.postal-code-field').forEach((element) =>element.classList.remove('invalid-field'));
          }}
          placeholder='XXXXX-(XXXX)'
        />
      </div>
    </div>
    </>
  );
};

export default CheckoutPaymentSection;

