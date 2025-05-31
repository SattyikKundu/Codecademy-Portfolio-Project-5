import { useState } from "react";
import ProfileFieldText from "../../PageComponents/profileFieldText/profileFieldText";

import './ProfilePage.css';

const initialProfile = {
  firstName: "Jim",
  lastName: "Smith",
  email: "BeanDippySkippy@example.com",
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
        label="ZIP Code"
        value={profile.zip}
        original={originalProfile.zip}
        onSave={val => handleSave("zip", val)}
      />
      <ProfileFieldText
        label="State"
        value={profile.state}
        original={originalProfile.state}
        onSave={val => handleSave("state", val)}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <div />
      <button type="submit" id='profile-submit'>Save All Changes</button>
    </form>
  );
};

export default ProfilePage;
