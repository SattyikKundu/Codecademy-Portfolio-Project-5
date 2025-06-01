/**************************************************************************************/
/**************** Utility Toast Success/Error functions *******************************/
/**************************************************************************************/

import toast from 'react-hot-toast';

export const addedToCartToast = () => { // toast for successful adding of product to cart
    toast.success('Added to Cart', {
        style: { // general style of toast message
            borderRadius: '10px',       // rounded message corners
            background: '#fff',         // white background
            border: '1px solid black',  // black border
            color: '#000',              // black text
            fontFamily: 'Arial',        // font-family of notification text
            fontWeight: 'Bold',         // font text bolded
        },
        duration: 1000,        // toast lasts 1 second
        position: 'top-right'  // place in general top-right area
    });
}

export const LoginSuccessToast = () => { // toast for successful login
    toast.success('Successfully Login', {
        style: { // general style of toast message
            borderRadius: '10px',       // rounded message corners
            background: '#fff',         // white background
            border: '1px solid black',  // black border
            color: '#000',              // black text
            fontFamily: 'Arial',        // font-family of notification text
            fontWeight: 'Bold',         // font text bolded
        },
        duration: 2000,        // toast lasts 3 second
        position: 'top-center'  // place in general top-center area
    });
}

export const LoginFailedToast = ({error = 'Login failed.'}) => { // toast for failed login attempt
    toast.error(error, {
        style: { // general style of toast message
            borderRadius: '10px',       // rounded message corners
            background: '#fff',         // white background
            border: '1px solid black',  // black border
            color: '#000',              // black text
            fontFamily: 'Arial',        // font-family of notification text
            fontWeight: 'Bold',         // font text bolded
        },
        duration: 2000,        // toast lasts 3 second
        position: 'top-center'  // place in general top-center area
    });
}

export const PhoneNumberErrorToast = () => { // toast for incorrect phone # format
    toast.error('Invalid phone number format.\nUse: XXX-XXX-XXXX.', {
        style: { // general style of toast message
            borderRadius: '10px',       // rounded message corners
            background: '#fff',         // white background
            border: '1px solid black',  // black border
            color: '#000',              // black text
            fontFamily: 'Arial',        // font-family of notification text
            fontWeight: 'Bold',         // font text bolded
            textAlign:'center'
        },
        duration: 2000,        // toast lasts 3 second
        position: 'top-center'  // place in general top-center area
    });
}

/* Converts a Unix timestamp in milliseconds (BIGINT) to a Month-Day-Year format.
 * Example output: "1-15-2012"
 *
 * param   {number} timestampMs - The Unix timestamp in milliseconds.
 * returns {string}             - The formatted date as "M-D-YYYY".
 */
export function formatTimestampToMDY(timestampMs) {
  if (!timestampMs) return ""; // Handle undefined/null case

  const date = new Date(timestampMs); // convert input into a Date() object
  const month = date.getMonth() + 1;  // JavaScript months start at 0
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}


