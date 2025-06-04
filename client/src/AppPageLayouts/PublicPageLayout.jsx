import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../Slices/authSlice";

import { Outlet, useLocation, useNavigate } from "react-router-dom"; // <Outlet> injects content based on active route
import BasePageLayout from './BasePageLayout/BasePageLayout'; // imports 'wrapper' layout for common page features

const PublicPageLayout = () => {

  const dispatch = useDispatch(); // initialize dispatch to use redux slices
  const navigate = useNavigate(); // initialize navigate to handle and route/redirects
  const location = useLocation(); // initialize location to track current url location/state
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated); // gets current authanticated by in 'user' store
                                                                            // SHOULD be filled via checkUserSession() logic.

  const [loading, setLoading] = useState(true); // tracks if checkUser session is done loading

  const checkUserSession = async () => { // function to check user session
    try {
      const response = await axios.get(
        'http://localhost:5000/auth/me', // accesses route that verifies if user is 
                                         // logged in (via checking for httpOnly cookie with JWT token)
        {withCredentials: true}          // ensures cookie is sent with request
      );
      if(response.data.user) { // if user data found/obtained
        dispatch(setUser(response.data.user));
      }
    }
    catch(error) { // log error
      console.log("User isn't logged in nor is there a valid cookie: ",error);
    }
    finally {
      setLoading(false); // Important! Blocks rendering until auth check finishes
    }
  }

  useEffect(() => { // On mount (or 'dispatch' dependency change), check for existing user session.
                    // Also this useEffect() will execute BEFORE the below one due to order they appear.
                    // This is important since checkUserSession() MUST execute first before the 2nd useEffect()
    checkUserSession();
  },[dispatch]);  // Runs on mount + whenever 'dispatch' changes
                  // In practice, 'dispatch' never changes, but satisfies linting best practices.
                  // (Example: ESLint is a commonly used linting tool used to check for code issues,etc.)

  
  useEffect(() => { // If logged in and visiting /login or /register, redirect to /profile
    if (isAuthenticated && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated,   // makes sure to run redirect check only after "auth" state is udpated (or 'changes')
      location.pathname, // effect triggers when URL changes; ensures effect reacts to changes in the path
      navigate]);        // stable and unchanging like [dispatch], but included for linting best practices.


  if (loading) { // Mainly used to PREVENT flickering/rendering of login/register page 
                 // (whilst user is logged in) until actual redirected page('/profile') is fully loaded.
    return <div>Loading...</div>; // Show some placeholder(like loading spinner or blank) until done
  }


  return ( 
    /* <BasePageLayout> is the 'wrapper' that provided common page features for the <PublicPageLayout> */
    <BasePageLayout>
        
      {/* <Outlet /> is the page body setion where content changes based on current route! */}
      <Outlet />

    </BasePageLayout>
  );
};

export default PublicPageLayout;