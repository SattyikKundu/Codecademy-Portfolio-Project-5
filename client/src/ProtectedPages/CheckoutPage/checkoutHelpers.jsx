/***************************************************************
 * SEVERAL utility functions that support the <CheckoutPage />.
 ***************************************************************/
import { ErrorMessageToast } from "../../utils/utilityFunctions";

/***************************************************************
 * Function #1: validates phone number as valid U.S. phone number 
 ***************************************************************/
export function isValidUSPhone(phone) { 

  /* Acceptable formats according to below regex:
    (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890, 1-123-456-7890, 1 (123) 456-7890
  */
  const regex = /^1?[\s\-\.]?(\(\d{3}\)|\d{3})[\s\-\.]?\d{3}[\s\-\.]?\d{4}$/;
  if (!regex.test(phone)) {
    return false;
  }

  const digits = phone.replace(/\D/g, ''); // remove all non-digits characters (i.e. like round brackets, hyphens, and periods)

  if (digits.length === 11 && digits.startsWith('1')) { // valid if digits start with 1 and is 11 digits long
    return true;
  } 
  if (digits.length === 10) { // valid if phone number if 10 digits
     return true;
  }
  return false; // otherwise reutrn false for invalid US phone number
}
 
/***********************************************************************************************
 * Function #2: Normalizes U.S. phone number for database storage (used after isValidUSPhone())
 *              (ex: 1234567890 => 1-123-456-7890)
 ***********************************************************************************************/
export function normalizeUSPhone(phone) { 
  
  let digits = phone.replace(/\D/g, ''); // First remove all non-digit characters

  if (digits.length === 10) { digits = '1' + digits; } // If 10 digits, add leading '1'

  // If not 11 digits or doesn't start with '1', return null (for invalid)
  if (digits.length !== 11 || !digits.startsWith('1')){ return null;} 

  // Format as 1-XXX-XXX-XXXX
  return `1-${digits.slice(1,4)}-${digits.slice(4,7)}-${digits.slice(7)}`;
} 

/***********************************************************************************************
 * Function #3: checks zip/postal code formatting via regex (format: xxxxx OR xxxxx-(xxxx))
 ***********************************************************************************************/
export const isValidZipCode = (zipCode) => { // 
  const regex = /^\d{5}(-\d{4})?$/;
  return regex.test(zipCode);
}

/***********************************************************************************************
 * Function #4: Validate each form field based on provided inputs
 ***********************************************************************************************/
export function validateField({value, message, selector, validator=null, toastDuration=2200, offset=104}) {

  const isInvalid = !value || (validator && !validator(value)); // checks if field value is null/invalid
  const elements = document.querySelectorAll(selector);         // get element(s) (if it exists) for provided selector

  if (isInvalid) { // if invalid value

    document.querySelectorAll('.invalid-field').forEach((el) => { // 1st, remove red borders from other 
      el.classList.remove('invalid-field');                       // previously flagged 'invalid' fields
    });

    elements.forEach((element) => { // 2nd, add red border to current invalid element(s)
      element.classList.add('invalid-field');
    });

    scrollAndFocusElement(selector, offset);    // 3rd, scroll and focus to selector
    ErrorMessageToast(message, toastDuration);  // 4th, error toast showing error message

    return false; // returns false for invalid field
  }
  return true; // returns true if field validated
}

/***********************************************************************************************
 * Function #5: Scrolls to focused element (via 'selection') and stop at offset from top.
 *              Used as helper function for validateField() above
 ***********************************************************************************************/
export function scrollAndFocusElement(selector, offset) { 

  const element = document.querySelector(selector); // find and return element
  if (!element) { return; }                         // if html element doesn't exist, return

  element.scrollIntoView({ behavior: 'instant', block: 'start' }); // Scroll instantly to prevent 
                                                                   // 'double scroll' flickering 
                                                                   // due to 108 offset
  window.scrollBy(0, -offset);  // Scroll to provided offset position
  element.focus({ preventScroll: true }); // tells the browser NOT to scroll the element into view when focusing it.
                                          // this prevents any additional, automatic scrolling.
}

/***********************************************************************************************
 * Function #6: Clicking outside of ANY input with '.invalid-input' class will cause
 *              the '.invalid-input', for current invalid field, to be removed, causing
 *              input field's red border and background to go back to default colors.
 ***********************************************************************************************/
export function setupOutsideClickToClearInvalidFields(formSelector = 'form') { // takes <form> as default input

  const handleClickOutside = (event) => { // click outside function

    setTimeout(() => { /* Schedules enclosed code to run 'asynchronously' after current call stack is cleared. 
                        * Used to ensure any focus changes (from click) have already taken effect before
                        * checking on the currently focused input.
                        */

      const form = document.querySelector(formSelector); // Checks if <form> selector is in document. 
      if (!form) return;                                 // otherwise, return.

      const activeInput = document.activeElement; // gets currently focused element on document

      const invalidInputs = form.querySelectorAll('.invalid-field'); // get ALL inputs with 'invalid-field' class

      invalidInputs.forEach(input => { // Loop through all invalid inputs in <form> to remove 'invalid-field' class
        if (input !== activeInput && !input.contains(event.target)) {
          input.classList.remove('invalid-field');
        }
      });
    }, 0); // 0ms delay to next event item in call stack
  };

  document.addEventListener('mousedown', handleClickOutside); // add fucntion as event listener when clicking outside

  return () => {   // Return a cleanup function for event listener
    document.removeEventListener('mousedown', handleClickOutside);
  };
}


