import { useState } from "react";
import ProfileFieldText from "../../PageComponents/profileFieldText/profileFieldText";
import ProfileFieldDisplay from "../../PageComponents/profileFieldDisplay/profileFieldDisplay";
import ProfileGroupedDropDownMenu from "../../PageComponents/profileGroupedDropDown/profileGroupedDropDown";
import { formatTimestampToMDY } from "../../utils/utilityFunctions";
import { groupedStateOptions } from "../../utils/statesOfAmericaData";

import './ProfilePage.css';

const initialProfile = {
  firstName: "Jim",
  lastName: "Smith",
  username: "Jsmithy",
  email: "BeanDippySkippy@example.com",
  phone: "703-456-4235",
  created: 1706570245780, // From unix timestamp in (ms), this is 1-29-2024
  // Profile stuff above (delivery stuff below)
  address1: "24446 Momo Drive",
  address2: "suite 245",
  city: "Dunham",
  zip: "20166",
  state: "VA",
};


const ProfilePage = () => {
  
  const [profile, setProfile] = useState(initialProfile); // State for current profile data

  const [originalProfile] = useState(initialProfile); // Immutable original snapshot (does not change)

  const handleSave = (field, newValue) => {
    setProfile(prev => ({ ...prev, [field]: newValue }));
  };

  return (
    <form
      className='profile-info-grid'
      onSubmit={e => {
        e.preventDefault();
        alert("Profile saved!");
      }}
    >
      <h2 id="profile-header-1">
        Profile Information
      </h2>
      <ProfileFieldText
        label="First Name"
        value={profile.firstName}
        original={originalProfile.firstName}
        onSave={val => handleSave("firstName", val)}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <ProfileFieldText
        label="Last Name"
        value={profile.lastName}
        original={originalProfile.lastName}
        onSave={val => handleSave("lastName", val)}
      />
      <ProfileFieldText
        label="Email"
        value={profile.email}
        original={originalProfile.email}
        onSave={val => handleSave("email", val)}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <ProfileFieldText
        label="Phone"
        value={profile.phone}
        original={originalProfile.phone}
        onSave={val => handleSave("phone", val)}
      />
      <ProfileFieldDisplay
        label="Account creation date"
        original={formatTimestampToMDY(originalProfile.created)}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <div id="profile-header-2">
        Your Current Shipping Address
      </div>
      <ProfileFieldText
        label="Street Address"
        value={profile.address1}
        original={originalProfile.address1}
        onSave={val => handleSave("address1", val)}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <ProfileFieldText
        label="Apartment, suite, unit, etc. (optional)"
        value={profile.address2}
        original={originalProfile.address2}
        onSave={val => handleSave("address2", val)}
      />
      <ProfileFieldText
        label="City"
        value={profile.city}
        original={originalProfile.city}
        onSave={val => handleSave("city", val)}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <ProfileFieldText
        label="ZIP Code"
        value={profile.zip}
        original={originalProfile.zip}
        onSave={val => handleSave("zip", val)}
      /> 
      <ProfileGroupedDropDownMenu
        label="State"
        value={profile.state}
        original={originalProfile.state}
        onSave={val => handleSave("state", val)}
        options={groupedStateOptions} 
        propStyle={{ backgroundColor: '#e9f0f2' }}
      />
      <div />
      <button type="submit" id='profile-submit'>Save All Changes</button>
    </form>
  );
};

export default ProfilePage;
