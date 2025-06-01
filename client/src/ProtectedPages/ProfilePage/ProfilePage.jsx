import { useState } from "react";
import ProfileFieldText from "../../PageComponents/profileFieldText/profileFieldText";
import ProfileFieldDisplay from "../../PageComponents/profileFieldDisplay/profileFieldDisplay";
import ProfileFieldStateMenu from "../../PageComponents/profileFieldStateMenu/profileFieldStateMenu";
import { formatTimestampToMDY } from "../../utils/utilityFunctions";

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

// U.S. state and territory options for react-select dropdown
export const groupedStateOptions = [
  {
    label: "U.S. States",
    options: [
      { value: "AL", label: "AL – Alabama" },
      { value: "AK", label: "AK – Alaska" },
      { value: "AZ", label: "AZ – Arizona" },
      { value: "AR", label: "AR – Arkansas" },
      { value: "CA", label: "CA – California" },
      { value: "CO", label: "CO – Colorado" },
      { value: "CT", label: "CT – Connecticut" },
      { value: "DE", label: "DE – Delaware" },
      { value: "FL", label: "FL – Florida" },
      { value: "GA", label: "GA – Georgia" },
      { value: "HI", label: "HI – Hawaii" },
      { value: "ID", label: "ID – Idaho" },
      { value: "IL", label: "IL – Illinois" },
      { value: "IN", label: "IN – Indiana" },
      { value: "IA", label: "IA – Iowa" },
      { value: "KS", label: "KS – Kansas" },
      { value: "KY", label: "KY – Kentucky" },
      { value: "LA", label: "LA – Louisiana" },
      { value: "ME", label: "ME – Maine" },
      { value: "MD", label: "MD – Maryland" },
      { value: "MA", label: "MA – Massachusetts" },
      { value: "MI", label: "MI – Michigan" },
      { value: "MN", label: "MN – Minnesota" },
      { value: "MS", label: "MS – Mississippi" },
      { value: "MO", label: "MO – Missouri" },
      { value: "MT", label: "MT – Montana" },
      { value: "NE", label: "NE – Nebraska" },
      { value: "NV", label: "NV – Nevada" },
      { value: "NH", label: "NH – New Hampshire" },
      { value: "NJ", label: "NJ – New Jersey" },
      { value: "NM", label: "NM – New Mexico" },
      { value: "NY", label: "NY – New York" },
      { value: "NC", label: "NC – North Carolina" },
      { value: "ND", label: "ND – North Dakota" },
      { value: "OH", label: "OH – Ohio" },
      { value: "OK", label: "OK – Oklahoma" },
      { value: "OR", label: "OR – Oregon" },
      { value: "PA", label: "PA – Pennsylvania" },
      { value: "RI", label: "RI – Rhode Island" },
      { value: "SC", label: "SC – South Carolina" },
      { value: "SD", label: "SD – South Dakota" },
      { value: "TN", label: "TN – Tennessee" },
      { value: "TX", label: "TX – Texas" },
      { value: "UT", label: "UT – Utah" },
      { value: "VT", label: "VT – Vermont" },
      { value: "VA", label: "VA – Virginia" },
      { value: "WA", label: "WA – Washington" },
      { value: "WV", label: "WV – West Virginia" },
      { value: "WI", label: "WI – Wisconsin" },
      { value: "WY", label: "WY – Wyoming" },
    ],
  },
  {
    label: "Federal District",
    options: [
      { value: "DC", label: "DC – District of Columbia" },
    ],
  },
  {
    label: "U.S. Territories",
    options: [
      { value: "AS", label: "AS – American Samoa" },
      { value: "GU", label: "GU – Guam" },
      { value: "MP", label: "MP – Northern Mariana Islands" },
      { value: "PR", label: "PR – Puerto Rico" },
      { value: "VI", label: "VI – U.S. Virgin Islands" },
    ],
  },
];


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
      <ProfileFieldStateMenu
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
