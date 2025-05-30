import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faRightToBracket, faUserLarge, faRightFromBracket  } from '@fortawesome/free-solid-svg-icons';

import { clearUser } from "../../Slices/authSlice";

import './menuUserProfile.css';

const ProfileButton = () => {

    const user = useSelector((state) => state.auth.user); // Get existing user from redux
    const isAuthenticated = useSelector((state) =>  state.auth.isAuthenticated); // checks if user is authenticated
    const dispatch = useDispatch(); // initialize dispatch of redux actions
    const navigate = useNavigate(); // initialize for route navigation

    const [showDropDown, setShowDropDown] = useState(false);// toggles dropdown depending on login
    const [loggingOut, setLoggingOut] = useState(false); // tracks if app is logging out
    const [error, setError] = useState(''); // tracks error

    const handleLogout = async () => {

      setLoggingOut(true);
      setError('');

      try {
        const response = await axios.get( 
          'http://localhost:5000/auth/logout', // logout endpoint (get)
          {withCredentials: true} // tell browser that if there's a cookie (httpOnly cookie with JWT),
                                  // add to request header when sending any HTTP request to backend.
        );

        dispatch(clearUser()); // clear user from redux state
        navigate('/login');    // navigate back to login
      }
      catch(err) { // catch error if issue while logging out
        setError(err);
        console.log('Error while logging out: ', error);
      }
      finally {
        setLoggingOut(false);
      }
    }

    const toggleDropDown = () => { // toggles dropdown menu
      setShowDropDown(prev => !prev);
    }


    if(!isAuthenticated) { // if unauthenticated, button links to login page
      return (
        <div 
          className='profile-bttn-container' 
          onClick={() => navigate('/login')}
          role='button'
          tabIndex={0}  
        >
          <FontAwesomeIcon icon={faRightToBracket} className='user-icon' />
        </div>
      );
    }

    if(isAuthenticated) { // otherwise, if authenticated...   
      return (
        <div className="profile-bttn-container">
          <div onClick={toggleDropDown}>
            <FontAwesomeIcon icon={faUserLarge} className='user-icon' />
          </div>
          {showDropDown && (
            <div className="dropdown-menu">
              <div className="dropdown-item"><strong>{user.username}</strong></div>
              <div 
                className="dropdown-item" 
                onClick={() => {
                    setShowDropDown(false); 
                    navigate("/profile");
                    }}
                >Profile</div>
              <div className="dropdown-item" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} /> Logout
              </div>
            </div>
          )}
        </div>
      );
    }
}

export default ProfileButton;