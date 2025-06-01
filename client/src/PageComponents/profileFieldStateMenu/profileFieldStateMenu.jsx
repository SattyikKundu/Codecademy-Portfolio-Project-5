import { useState, useEffect, useRef } from "react";
import "./profileFieldStateMenu.css";

const ProfileFieldStateMenu = ({ label, value, original, onSave, options, propStyle = {} }) => {  // props for profile field-value 
                                                                                 // component ('propsStyle' optional)

  const [editing, setEditing] = useState(false);           // tracks if field is in 'editing' mode or not
  const [draft, setDraft] = useState(value);               // holds edited/selected value as 'draft'
  const [dropdownOpen, setDropdownOpen] = useState(false); // tracks open/close state of dropdown menu

  const dropdownRef = useRef(null); // Use to refer selected <div> object for manipulating DOM element.
                                    // specifically using it for clicking outside to close dropdown menu.

  /*****************************************************************************/
  /********************* useEffects ********************************************/
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

  const handleEdit = () => { // enables editing of field value 
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
      if (found) return found.label;
    }
    return value;
  };

  /*****************************************************************************/
  /********************* Returned component ************************************/
  /*****************************************************************************/

  return (
    <div className="state-field-wrapper" style={propStyle}>
      {/* Label for field */}
      <div className="state-field-label">{label}</div>

      {/* wrapper that holds field display values, editing fields, and buttons */}
      <div className="field-value-buttons-wrapper">
        {editing ? (
          <>
          {/* Dropdown container wrapper that hold's relative positioning.
              Also clicking outside this box causes menu to close. */}
          <div className="field-dropdown-container" ref={dropdownRef}>

            {/* dropdown selection container that triggers dropdown menu on click. */}
            <div className="field-dropdown-display" onClick={toggleDropdown} >
                <span className="selected-state-value">{findLabel(draft)}</span>
                <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
            </div>

            {dropdownOpen && ( 
               /* Opens dropdown box when clicked. Also, with absolute postioning,
                * it's placed relative to '.field-dropdown-container' and under the visible selection.
                */
              <div className="field-dropdown-list">

                {options.map((group) => ( // iterates over each group (ex: 'U.S. States', 'U.S. Territories')
                  <div key={group.label} className="state-dropdown-group">

                    {/* Adds group label (ex: 'U.S. States') to dropdown box (for organization, and is unselectable) */}
                    <div className="state-group-label">{group.label}</div>

                    {group.options.map((option) => ( // iterates and returns each option for current group
                      <div
                        key={option.value}
                        className={`state-dropdown-option ${option.value === draft ? "selected" : ""}`}
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

          {/* Buttons visible in 'editing' mode */}
          <div className="edit-buttons">
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={handleCancel}>✖</button>
          </div>
         </>
        ) : (
          <>
          {/* (current) field value and editing buttons in 'display' mode */}
          <div className="state-field-value">{findLabel(draft)}</div>
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

export default ProfileFieldStateMenu;
