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

/* NOTE: If passing a 'prop' from an old page to trigger a toast on the new page (via redirect),
 *       this can lead to an issue where the it looks like there 2 simultaneous overlapping props.
 */

export const SuccessMessageToast = (message, time=2000, place='top-center') => { // toast for returned success message
    toast.success(message, {
        style: { // general style of toast message
            borderRadius: '10px',       // rounded message corners
            background: '#fff',         // white background
            border: '1px solid black',  // black border
            color: '#000',              // black text
            fontFamily: 'Arial',        // font-family of notification text
            fontWeight: 'Bold',         // font text bolded
        },
        duration: time,    // toast lasts 3 second
        position: place    // place in general top-center area
    });
}

export const ErrorMessageToast = (error, time=2000, place='top-center') => { // toast for returned error message
    toast.error(error, {
        style: { // general style of toast message
            borderRadius: '10px',       // rounded message corners
            background: '#fff',         // white background
            border: '1px solid black',  // black border
            textAlign: 'center',        // centers text
            color: '#000',              // black text
            fontFamily: 'Arial',        // font-family of notification text
            fontWeight: 'Bold',         // font text bolded
        },
        duration: time,  // toast lasts 3 second
        position: place  // place in general top-center area
    });
}

/* NOTE: It's possible to create a custom toast with unique features like an 'x' button to   
 *       manually delete the toast (if toast is persisting too long.). Consider creating a
 *       custom toast with this feature later. Basic outline example:
 * 
 *       import React from 'react'; // if using react components in custom version
 * 
 *       export const functionName = (message, time, place) => {
 *           toast.custom(
 *              (t) => { // Custom React code and style for custom toast },
 *                      { duration: time, position: place }
 *           );
 *       };        
 */





/* Converts a Unix timestamp in milliseconds (BIGINT) to a Month-Day-Year format.
 * Example output: "1-15-2012"
 *
 * param   {number} timestampMs - The Unix timestamp in milliseconds.
 * returns {string}             - The formatted date as "M-D-YYYY".
 */
export function formatTimestampToMDY(timestampMs) {
  if (!timestampMs) return ""; // Handle undefined/null case

  const date = new Date(Number(timestampMs)); // convert string input into number first!
                                              // Then push it into a Date() object

  const month = date.getMonth() + 1;  // JavaScript months start at 0
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}

/* Alternative function that converts a Unix timestamp in milliseconds (BIGINT) to a Month Day, Year format.
 * Example output: "June 15, 2012"
 *
 * param   {number} timestampMs - The Unix timestamp in milliseconds.
 * returns {string}             - The formatted date as "Month Day, Year".
 */

export function formatTimestampToLongDate(timestampMs) {
  if (!timestampMs) return ""; // Handle undefined/null case

  const date = new Date(Number(timestampMs));
  // Example output: June 25, 2016
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}



