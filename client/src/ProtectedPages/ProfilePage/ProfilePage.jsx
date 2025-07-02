/* React imports */
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

/* Pagec component imports  */
import ProfileFieldText from "../../PageComponents/profileFieldText/profileFieldText";
import ProfileFieldDisplay from "../../PageComponents/profileFieldDisplay/profileFieldDisplay";
import ProfileGroupedDropDownMenu from "../../PageComponents/profileGroupedDropDown/profileGroupedDropDown";
import FooterBottom from "../../PageComponents/footerBottom/footerBottom";

/* Middleware (custom util) code */
import { formatTimestampToMDY } from "../../utils/utilityFunctions";
import { groupedStateOptions } from "../../utils/statesOfAmericaData";
import { ErrorMessageToast, SuccessMessageToast } from "../../utils/utilityFunctions";

import './ProfilePage.css';

const ProfilePage = () => {
  
  const location = useLocation(); // initialize useLocation reference
  const navigate = useNavigate(); // initialize navigate for programmatic page navigation

  const [profile,                 setProfile] = useState(null); // Initial state as null until data loads
  const [originalProfile, setOriginalProfile] = useState(null); // Original inital state stored as snapshot for 'Undo' features
  const [loading,                 setLoading] = useState(true); // tracks loading state of profile
  const [searchParams,       setSearchParams] = useSearchParams(); // used to check for successful login from URL params()
  const [formSubmitted,     setFormSubmitted] = useState(false); // tracks if profile (updated) form is submitted

  const loginSuccessFromQuery = searchParams.get('loginSuccess') === '1';

  useEffect(() => { // returns login toast ONLY when user comes to Profile page upon succesful login (or via Google oauth)
    if (location.state?.loginSuccess || loginSuccessFromQuery) {

      setTimeout(() => { // trigger successful login toast
        SuccessMessageToast('Successful Login!');
      }, 400); 

      if (loginSuccessFromQuery) { // Clear query param if it came from the URL
        searchParams.delete('loginSuccess');
        setSearchParams(searchParams, { replace: true });
      }

      navigate(location.pathname, { replace: true, state: {} }); // Clears location state to prevent repeat toast 
                                                                 // when navigating backwards to this page
    }
  }, [location.state, location, navigate, searchParams, loginSuccessFromQuery]);

//  location, navigate, searchParams, setSearchParams, loginSuccessFromQuery


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

    setFormSubmitted(true);  // checks that profile is submitted/updated (used to close open fields)

    if (areProfilesEqual(profile, originalProfile)) {  // skip form submit if no changes made
      window.scrollTo({ top: 0, behavior: 'smooth' }); // smooth scroll to top profile on click
      SuccessMessageToast('No changes detected.', 1000);
      return;
    }

    try {
      const response = await axios.patch( // use patch() to send updated profile values to backend
        'http://localhost:5000/profile',  
        profile,                          // 'profile' contains final profile values array to update in database
        { withCredentials: true }         // Checks for and extracts JWT token in httpOnly cookie. Then token
                                          // is added to HTTP/HTTPS request header to backend. This allows backend
                                          // to confirm secure cross-origin authentication using the JWT token.
      );

      if (response.data.user) {                 // If updated user data is truthy..
        setProfile(response.data.user);         // Update local state with updated data
        setOriginalProfile(response.data.user); // Refresh snapshot
        window.scrollTo({ top: 0, behavior: 'smooth' });  // smooth scroll to top profile on click
        SuccessMessageToast('Profile updated successfully!');
      }
    } 
    catch (error) { // otherwise catch and notify error
      console.error('Error updating profile:', error);
      const errorMsg = error.response?.data?.error || 'Failed to update profile.';
      ErrorMessageToast(errorMsg);
    }
    finally {
      setFormSubmitted(false); // sets that form is done submitting
    }
  };

  const areProfilesEqual = (profileUpdated, profileOriginal) => { 
    // checks if 'profile' is same as 'originalProfile' 
    // (to see if changes were made or not).
    // CAN update to a more ROBUST version later on...
    return JSON.stringify(profileUpdated) === JSON.stringify(profileOriginal);
  }

  if (loading) {   // If data is still loading, show loading state
    return <h2 style={{ margin: 'auto' }}>Loading profile...</h2>;
  }

  if (!profile) { // If no profile, show notice.
    return <h2 style={{ margin: 'auto' }}>Profile not found.</h2>;
  }

  if(!loading){
  return (
    <>
    <div className="profile-page-wrapper-full" data-bg-var-repaint>
    <form className='profile-info-grid' onSubmit={handleSubmit}>
      <h2 id="profile-header-1">
        Profile Information
      </h2>
      <ProfileFieldText
        label="First Name"
        value={profile.first_name}
        original={originalProfile.first_name}
        onSave={val => handleSave("first_name", val)}
        exitEditMode={formSubmitted}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <ProfileFieldText
        label="Last Name"
        value={profile.last_name}
        original={originalProfile.last_name}
        onSave={val => handleSave("last_name", val)}
        exitEditMode={formSubmitted}
      />
      <ProfileFieldText
        label="Email"
        value={profile.email}
        original={originalProfile.email}
        onSave={val => handleSave("email", val)}
        exitEditMode={formSubmitted}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <ProfileFieldText
        label="Phone"
        value={profile.phone_number}
        original={originalProfile.phone_number}
        onSave={val => handleSave("phone_number", val)}
        exitEditMode={formSubmitted}
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
        exitEditMode={formSubmitted}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <ProfileFieldText
        label="Apartment, suite, unit, etc. (optional)"
        value={profile.address_line2}
        original={originalProfile.address_line2}
        onSave={val => handleSave("address_line2", val)}
        exitEditMode={formSubmitted}
      />
      <ProfileFieldText
        label="City"
        value={profile.city}
        original={originalProfile.city}
        onSave={val => handleSave("city", val)}
        exitEditMode={formSubmitted}
        propStyle={{backgroundColor: '#e9f0f2'}}
      />
      <ProfileFieldText
        label="ZIP Code"
        value={profile.postal_code}
        original={originalProfile.postal_code}
        onSave={val => handleSave("postal_code", val)}
        exitEditMode={formSubmitted}
      /> 
      <ProfileGroupedDropDownMenu
        label="State"
        value={profile.state}
        original={originalProfile.state}
        onSave={val => handleSave("state", val)}
        exitEditMode={formSubmitted}
        options={groupedStateOptions} 
        propStyle={{ backgroundColor: '#e9f0f2' }}
      />
      <div />
      <button type="submit" id='profile-submit'>Save All Changes</button>
    </form>

    <FooterBottom />
    </div>
    </>
  );
  }
};

export default ProfilePage;
