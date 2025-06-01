
import './profileFieldDisplay.css';

const ProfileFieldDisplay = ({ label, original, propStyle={} }) => { // used ONLY to display values (propStyle optional input)


  return (
    // Field & value wrapper with optional style prop
    <div className='field-wrapper' style={propStyle}>

      {/* Holds field label (i.e. username, email, first name, etc.) */}
      <div className="field-label">{label}</div>

      {/* Holds displayed value for field */}
      <div className="field-value-display-wrapper">
            <div className="field-value-display">{original}</div>
            {/* Placeholder for empty buttons */}
            <div className="empty-buttons"></div>
      </div>
    </div>
  );
};

export default ProfileFieldDisplay;