import { CardNumberElement, 
         CardExpiryElement, 
         CardCvcElement 
        } from '@stripe/react-stripe-js';

import { useState } from 'react';

import './checkoutPaymentSection.css';

const CheckoutPaymentSection = ({orderTotal}) => {

  const [postalCode, setPostalCode] = useState('');

  const isValidZipCode = (zipCode) => {
    const regex = /^\d{5}(-\d{4})?$/;
    return regex.test(zipCode);
  }


  return (
    <div className='checkout-payment-container'>
      <div className='checkout-payment-header'>4. PAYMENT METHOD</div>
      <div className='checkout-divider' />

      <div className='checkout-payment-label-and-input'>
        <div className='checkout-payment-label'>Card Number*</div>
        <div className='checkout-payment-stripe-input'>
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
          />
        </div>
      </div>

      <div className='checkout-payment-label-and-input'>
        <div className='checkout-payment-label'>Expiration Date*</div>
        <div className='checkout-payment-stripe-input'>
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
          />
        </div>
      </div>

      <div className='checkout-payment-label-and-input'>
        <div className='checkout-payment-label'>CVC*</div>
        <div className='checkout-payment-stripe-input'>
          <CardCvcElement
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
          />
        </div>
      </div>

      <div className='checkout-payment-label-and-input'>
        <div className='checkout-payment-label'>Postal Code*</div>
        <div 
          className='checkout-payment-stripe-input'
          onClick={() => {document.getElementById('postal-code').focus()}}
        >
          <input
            type='text'
            id='postal-code'
            name='postal-code'
            maxLength='10'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder='XXXXX-XXXX'
            required
          />
        </div>
      </div>

      <div className='checkout-payment-submit'>
        <button type="button" disabled={false /* disable when loading later */}>
          Pay ${orderTotal.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPaymentSection;
