import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

/* 
 * Instead of a standard password field. This custom component
 * uses an 'eye' icon to toggle the password visibility as it's typed.
 * This feature is common in password fields within many professional apps.
 */

import './passwordInput.css'; // necessary styling

const PasswordInput = ({ value, onChange, name, placeholder }) => { // passes common <input> props

  const [showPassword, setShowPassword] = useState(false); // tracks toggle state of password visibility

  return (
    <div className="custom-password-input-wrapper">
      <input
        type={showPassword ? 'text' : 'password'} // input type toggles between 'text' and 'password'
        value={value}                             // passed visible text as typed via onChange
        onChange={onChange}                       // passed onChange function for updating stored typed value
        name={name}                               // passed name for field
        placeholder={placeholder}                 // passed placeholder for empty <input>
        required                                  // text/password field is required
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)} // toggles show/hide password on icon click
        aria-label={showPassword ? "Hide password" : "Show password"} // toggles aria-label
      >
        {
            showPassword ? 
            (<FontAwesomeIcon icon={faEyeSlash} className='eye-icon'/>) : 
            (<FontAwesomeIcon icon={faEye}      className='eye-icon'/>)
        }
      </button>
    </div>
  );
};

export default PasswordInput;
