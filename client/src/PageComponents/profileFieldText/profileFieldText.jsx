import { useState, useEffect } from "react";

import { ErrorMessageToast } from "../../utils/utilityFunctions";
import './profileFieldText.css';

const ProfileFieldText = ({ label, value, original, onSave, exitEditMode, propStyle={} }) => { // props for profile field-value 
                                                                                 // component ('propsStyle' optional)

  const [editing, setEditing] = useState(false); // tracks if field is in 'editing' mode or not
  const [draft, setDraft] = useState(value);     // holds edited value as 'draft'

  useEffect(() => {  // Keep 'draft' in sync with parent value (especially needed for )
    setDraft(value);
  }, [value]);

  useEffect(() => {    // used to close edit on submission
    if(exitEditMode) { // triggers closing of dropdown menu if 'editing' state when 'exitEditMode' is toggled
      setEditing(false);
      setDraft(value);
    }
  }, [exitEditMode, value]);

  const handleRevert = () => { /* If value edited, can be reverted to original value from database */
    setDraft(original);
  };

  const handleSave = () => { /* Enables saving of edited/orginal back via onSave prop function */
    setEditing(false);
    if (label === "Phone" && !isValidPhone(draft)) {  // Only validate phone format if using 'Phone' field
      ErrorMessageToast('Invalid phone number format.\nUse: XXX-XXX-XXXX.');
      setDraft(value); // revert to original if invalid
      return;
    }
    
    if (value !== draft && draft.trim().length > 0) { // save value if different from original AND not null/empty
      onSave(draft);
    }
    else if (draft.trim().length === 0) {
      ErrorMessageToast('You cannot save \n an empty value.');
    }
  };

  const handleCancel = () => { /* Can cancel in middle of field value editing */
    setEditing(false);
    setDraft(value);
  };

  const handleEdit = () => { /* toggles editing of field value */
    setEditing(true);
  };

 
  function isValidPhone(input) {  // Use in handleSave() if 'Phone' label is used
    const pattern = /^\d{3}-\d{3}-\d{4}$/; // regex to validate xxx-xxx-xxxx are all digits
    return pattern.test(input);
  }


  return (
    // Field & value wrapper with optional style prop
    <div className='field-wrapper' style={propStyle}>

      {/* Holds field label (i.e. username, email, first name, etc.) */}
      <div className="field-label">{label}</div>

      {/* Holds displayed field value as well as editing buttons */}
      <div className="field-value-buttons-wrapper">
        {editing ? (
          <>
            {/* If in 'editing' mode, user can edit in <input> as well 
                as save edited value and cancel editing midway */}
            <input
              className='field-input-box'
              value={draft}
              onChange={e => setDraft(e.target.value)}
            />
            <div className="edit-buttons">
              <button type="button" onClick={handleSave}>Save</button>
              <button type="button" onClick={handleCancel}>✖</button>
            </div>
          </>
        ) : (
          <>
            {/* If in 'display' mode, can click 'Edit' button to switch to 'editing' mode
                as well as click 'Undo' to revert edited value back to original field value. */}
            <div className="field-value">
              <span>{draft}</span>
            </div>
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

export default ProfileFieldText;