import { useState,      // react hook for tracking local states
        useEffect,      // hook for triggering side-effect due to condition change(s  )
        useRef,         // hook for storing a refernce to a DOM element (and its properties) that persists across renders
        useLayoutEffect // hook runs synchronously after DOM updates but before browser repaints,
                        // enabling layout modification without visible flickr
      } from "react";

import "./profileGroupedDropDown.css";

const ProfileGroupedDropDownMenu = ({ label, value, original, onSave, options, propStyle = {}}
                                      ) => { // props for profile field-value
                                              // component ('propsStyle' optional)

  const [editing,             setEditing] = useState(false); // tracks if field is in 'editing' mode or not
  const [draft,                 setDraft] = useState(value); // holds edited/selected value as 'draft'
  const [dropdownOpen,   setDropdownOpen] = useState(false); // tracks open/close state of dropdown menu
  const [dropDownWidth, setDropDownWidth] = useState(null);  // stores width of menu box to match dropdown selector

  const dropdownRef = useRef(null); // Use to refer selected <div> object for manipulating DOM element.
                                    // specifically using it for clicking outside to close dropdown menu.

  const selectorWidthRef = useRef(null); // Used to refer to '.field-dropdown-display' to tracks its width

  /*****************************************************************************/
  /********************* useEffects and useLayout ******************************/
  /*****************************************************************************/

  useEffect(() => { // ensures that edited changes and draft value syncs
    setDraft(value);
  }, [value]);

  useEffect(() => { // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
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
  }, [editing]); // useLayoutEffect triggers when 'editing' toggles

  /*****************************************************************************/
  /********************* Essential Methods *************************************/
  /*****************************************************************************/

  const handleRevert = () => { // If value edited, can be reverted to original value from database 
    setDraft(original);
  };

  const handleSave = () => { // Enables saving of edited/orginal back via onSave prop function
    setEditing(false);
    setDropdownOpen(false);
    if (value !== draft && draft.trim().length > 0) {
      onSave(draft);
    }
  };

  const handleCancel = () => { // Can cancel in middle of field value editing
    setEditing(false);
    setDraft(value);
    setDropdownOpen(false);
  };

  const handleEdit = () => {// enables editing of field value
    setEditing(true);
  };

  const toggleDropdown = () => { // toggles dropdown menu
    setDropdownOpen((prev) => !prev);
  };

  const handleSelect = (value) => { // handles selection from open dropdown menu
    setDraft(value);
    setDropdownOpen(false);
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
    <div className="grouped-dropdown-field-wrapper" style={propStyle}>

      {/* Label for field */}
      <div className="grouped-dropdown-field-label">{label}</div>

      {/* wrapper holds field display values, editing fields, and buttons */}
      <div className="grouped-dropdown-field-and-buttons-wrapper">
        {editing ? (
          <>
            {/* container wrapper that hold's 'relative' positioning property */}
            <div className="grouped-dropdown-container-wrapper">

              {/* 'ref' used to trigger closing menu by clicking outside */}
              <div className="grouped-dropdown-container" ref={dropdownRef}>

                {/* dropdown selection container that triggers dropdown menu on click. */}
                <div className="grouped-dropdown-display" onClick={toggleDropdown} ref={selectorWidthRef} >
                  <span className="selected-dropdown-value">{findLabel(draft)}</span>
                  <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
                </div>

                {dropdownOpen && (
                  /* Opens dropdown box when clicked. With absolute postioning,
                   * it's placed relative to '.field-dropdown-container' and under the visible selection.
                   * Also, the width in below dropdown list matches dropdown selector.
                   */
                  <div className="grouped-dropdown-list" style={{ width: dropDownWidth - 5 }} >
                    {options.map((group) => ( // iterates over each group (ex: 'U.S. States', 'U.S. Territories')
                        <div key={group.label} className="dropdown-options-group">

                          {/* Adds group label (ex: 'U.S. States') to dropdown box (for organization, and is unselectable) */}
                          <div className="group-label">{group.label}</div>

                          {group.options.map((option) => ( // iterates and returns each option for current group
                              <div 
                                key={option.value}
                                className={`selected-dropdown-option ${ option.value === draft ? "selected" : ""}`}
                                onClick={() => handleSelect(option.value)}
                              >
                                {option.label}
                              </div>
                            )
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Buttons visible in 'editing' mode */}
            <div className="edit-buttons">
              <button type="button" onClick={handleSave}>Save</button>
              <button type="button" onClick={handleCancel}>✖</button>
            </div>
          </>
        ) : (
          <>
            {/* (current) field value and editing buttons in 'display' mode */}
            <div className="grouped-dropdown-field-value">{findLabel(draft)}</div>
            <div className="edit-buttons">
              <button type="button" onClick={handleEdit}>Edit</button>
              {draft !== original && (
                <button type="button" onClick={handleRevert}>Undo</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileGroupedDropDownMenu;
