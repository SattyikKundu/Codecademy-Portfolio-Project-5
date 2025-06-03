import { useState, useEffect } from "react";
import axios from "axios";

import ProfileFieldText from "../../PageComponents/profileFieldText/profileFieldText";
import ProfileFieldDisplay from "../../PageComponents/profileFieldDisplay/profileFieldDisplay";
import ProfileGroupedDropDownMenu from "../../PageComponents/profileGroupedDropDown/profileGroupedDropDown";
import { formatTimestampToMDY } from "../../utils/utilityFunctions";
import { groupedStateOptions } from "../../utils/statesOfAmericaData";

import { ErrorMessageToast, SuccessMessageToast } from "../../utils/utilityFunctions";

import './ProfilePage.css';

/*
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
}; */


const ProfilePage = () => {
  
  //const [profile, setProfile] = useState(initialProfile); // State for current profile data
  //const [originalProfile] = useState(initialProfile); // Immutable original snapshot (does not change)

  const [profile, setProfile] = useState(null);                 // Initial state as null until data loads
  const [originalProfile, setOriginalProfile] = useState(null); // Original inital state stored as snapshot 
                                                                // for 'Undo' features
  const [loading, setLoading] = useState(true); // tracks loading state
    
  const fetchProfile = async () => { // async function for fetching user's profile data
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/profile', { withCredentials: true });

      setProfile(response.data.user);         // store initial user data (prior to editing)
      setOriginalProfile(response.data.user); // Set snapshot for comparison
    } 
    catch (error) { // error handling 
      console.log('Error fetching profile:', error);
      ErrorMessageToast('Failed to load profile data');
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => { // Fetch user profile data on mount
    fetchProfile();
  }, []);
  

  const handleSave = (field, newValue) => { // Handle saving of individual field edits (updates local state only)
    setProfile(prev => ({ ...prev, [field]: newValue }));
  };

    
  const handleSubmit = async (event) => { // Submit button function for handling final save of all changes to backend
    event.preventDefault(); // prevent page reload on submit
    try {
      const response = await axios.patch( // use patch() to send updated profile values to backend
        'http://localhost:5000/profile',  
        profile,                          // 'profile' contains final profile values array to update in database
        { withCredentials: true }         // Checks for and extracts JWT token in httpOnly cookie. Then token
                                          // is added to HTTP/HTTPS request header to backend. This allows backend
                                          // to confirm secure cross-origin authentication using the JWT token.
      );

      if (response.data.user) { // If updated user data is truthy..
        setProfile(response.data.user);         // Update local state with updated data
        setOriginalProfile(response.data.user); // Refresh snapshot
        SuccessMessageToast('Profile updated successfully!');
      }
    } 
    catch (error) { // otherwise catch and notify error
      console.console('Error updating profile:', error);
      ErrorMessageToast('Failed to update profile.');
    }
  };

  // If data is still loading, show loading state
  if (loading) {
    return <h2 style={{ margin: 'auto' }}>Loading profile...</h2>;
  }

  if (!profile) {
    return <h2 style={{ margin: 'auto' }}>Profile not found.</h2>;
  }
  if(!loading){
  return (
    //<form className='profile-info-grid' onSubmit={e => { e.preventDefault(); alert("Profile saved!"); }}> 
    <form className='profile-info-grid' onSubmit={handleSubmit}>
      <h2 id="profile-header-1">
        Profile Information
      </h2>
      <ProfileFieldText
        label="First Name"
        value={profile.first_name}
        original={originalProfile.first_name}
        onSave={val => handleSave("first_name", val)}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <ProfileFieldText
        label="Last Name"
        value={profile.last_name}
        original={originalProfile.last_name}
        onSave={val => handleSave("last_name", val)}
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
        value={profile.phone_number}
        original={originalProfile.phone_number}
        onSave={val => handleSave("phone_number", val)}
      />
      <ProfileFieldDisplay
        label="Account creation date"
        original={formatTimestampToMDY(originalProfile.created_at)}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <div id="profile-header-2">
        Home Address for Shipping
      </div>
      <ProfileFieldText
        label="Street Address"
        value={profile.address_line1}
        original={originalProfile.address_line1}
        onSave={val => handleSave("address_line1", val)}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <ProfileFieldText
        label="Apartment, suite, unit, etc. (optional)"
        value={profile.address_line2}
        original={originalProfile.address_line2}
        onSave={val => handleSave("address_line2", val)}
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
        value={profile.postal_code}
        original={originalProfile.postal_code}
        onSave={val => handleSave("postal_code", val)}
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
  }
};

export default ProfilePage;
