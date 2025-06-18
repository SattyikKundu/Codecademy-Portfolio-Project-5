import { useState,      // react hook for tracking local states
        useEffect,      // hook for triggering side-effect due to condition change(s  )
        useRef,         // hook for storing a refernce to a DOM element (and its properties) that persists across renders
        useLayoutEffect // hook runs synchronously after DOM updates but before browser repaints,
                        // enabling layout modification without visible flickr
      } from "react";

import './checkoutStateDropDown.css'


const CheckoutStateDropDown = ({ options, selectedOption, onSelect }) => {

  const [dropdownOpen,   setDropdownOpen] = useState(false); // tracks open/close state of dropdown menu
  const [dropDownWidth, setDropDownWidth] = useState(null);  // stores width of menu box to match dropdown selector

  const dropdownRef = useRef(null); // Use to refer selected <div> object for manipulating DOM element.
                                    // specifically using it for clicking outside to close dropdown menu.

  const selectorWidthRef = useRef(null); // Used to refer to '.field-dropdown-display' to tracks its width

  /*****************************************************************************/
  /********************* useEffects and useLayout ******************************/
  /*****************************************************************************/

  useEffect(() => { // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);

        /* If dropdown has red border/background due to invalid or empty selection.
         * remove red color when user closes/clicks outside the dropdown box
         */
        const dropdownBox = document.querySelector('#state-dropdown-menu-box');
        if (dropdownBox?.classList.contains('invalid-field')) {
          dropdownBox.classList.remove('invalid-field');
        }

      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => { // tracks width of dropdown selector so it can be used
                          // to make selection box match width
    const updateWidth = () => {
      if (selectorWidthRef.current) {
        const measuredWidth = selectorWidthRef.current.offsetWidth;
        setDropDownWidth(measuredWidth);
      }
    };
    updateWidth(); // Run once on mount
    window.addEventListener("resize", updateWidth); // Add window resize listener
    return () => window.removeEventListener("resize", updateWidth); // Cleanup on unmount
  }, []); // useLayoutEffect triggers on mount

  /*****************************************************************************/
  /********************* Essential Methods *************************************/
  /*****************************************************************************/

  const toggleDropdown = () => { // toggles dropdown menu
    setDropdownOpen((prev) => !prev);
  };

  const handleSelect = (value) => { // handles selection from open dropdown menu
    setDropdownOpen(false);
    onSelect(value); // to save saved value into parent component

    // turns 'off' red background and border on select
    const dropdownBox = document.querySelector('#state-dropdown-menu-box');
    if (dropdownBox?.classList.contains('invalid-field')) {
      dropdownBox.classList.remove('invalid-field');
    }
  };

  const findLabel = (value) => { // retrieve display label for the current 'draft' value
    for (const group of options) {
      const found = group.options.find((option) => option.value === value);
      if (found) {
        return found.label;
      } 
    }
    return value;
  };

  /*****************************************************************************/
  /********************* Returned component ************************************/
  /*****************************************************************************/

   return (
    <div className="checkout-dropdown-container-wrapper">
      <div className="checkout-dropdown-container" ref={dropdownRef}>
        <div
          className="checkout-dropdown-display"
          id='state-dropdown-menu-box'
          onClick={toggleDropdown}
          ref={selectorWidthRef}
          onChange={(event) => {
            onSelect(event.target.value); 
            event.target.classList.remove('invalid-field');
          }}
        >
          <span className="selected-dropdown-state">
             {findLabel(selectedOption) || "Select state for shipping"}
          </span>
          <span className="open-close-arrow">{dropdownOpen ? "▲" : "▼"}</span>
        </div>

        {dropdownOpen && (
          <div
            className="checkout-dropdown-list"
            style={{ width: dropDownWidth - 5 }}
          >
            {options.map((group) => (
              <div key={group.label} className="dropdown-options-group">
                <div className="grouped-label">{group.label}</div>
                {group.options.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown-options-state ${
                      option.value === selectedOption ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

};


export default CheckoutStateDropDown;