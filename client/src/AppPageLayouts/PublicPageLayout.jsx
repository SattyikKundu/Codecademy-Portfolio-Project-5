import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, clearUser } from "../Slices/authSlice";

import { Outlet, useLocation, useNavigate } from "react-router-dom"; // <Outlet> injects content based on active route
import BasePageLayout from './BasePageLayout/BasePageLayout'; // imports 'wrapper' layout for common page features

const PublicPageLayout = () => {

  const dispatch = useDispatch(); // initialize dispatch to use redux slices
  const navigate = useNavigate(); // initialize navigate to handle and route/redirects
  const location = useLocation(); // initialize location to track current url location/state

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated); // gets user's current authanticated state 
                                                                            // in 'user' store.SHOULD be filled via 
                                                                            // checkUserSession() logic.

  const [loading, setLoading] = useState(true); // tracks when checkUserSession() completes checking for auth token

  const checkUserSession = async () => { // function to check user session
    setLoading(true);                    // Reset loading before rechecking
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/me`, // accesses route that verifies if user is 
                                                        // logged in (via checking for httpOnly cookie with JWT token)
        {withCredentials: true}                         // ensures cookie is sent with request
      );

      if(response.data.user) {                 // if user data found/obtained
        dispatch(setUser(response.data.user)); // store user data onto redux
      }
      else { // If invalid, remove defunct user data/token
        dispatch(clearUser());
      }
    }
    catch(error) { // catch and log error
      //console.log("In checkUserSession(), token invalid or missing: ", error);
      dispatch(clearUser());
    }
    finally {
      setLoading(false); // Blocks rendering until checking for existing user session finishes
    }
  }

  useEffect(() => { // On mount (or 'dispatch' dependency change), check for existing user session.
                    // Also this useEffect() will execute BEFORE the below one due to order they appear.
                    // This is important since checkUserSession() MUST execute first before the 2nd useEffect()
    checkUserSession();
  },[dispatch]);  // Runs on mount + whenever 'dispatch' changes
                  // In practice, 'dispatch' never changes, but satisfies linting best practices.
                  // (Example: ESLint is a commonly used linting tool used to check for code issues,etc.)


  useEffect(() => { // used to checkUserSession() IF page is called from bfcache

    const handlePageShow = (event) => { // function to handle pageshow being fired
      if (event.persisted) { // If pageShow exists (restored from bfcache), execute user session check
        checkUserSession(); //  This flip loading=false once done
      }
    };
    window.addEventListener('pageshow', handlePageShow); // adds function to 'pageshow' event listener
    return () => {window.removeEventListener('pageshow', handlePageShow);} // clean up function
  }, []);


  useEffect(() => { // If logged in and visiting /login or /register, redirect to /profile

    if (loading) return; // block navigation logic UNTIL loading done

    if (isAuthenticated && (location.pathname === "/login" || location.pathname === "/register")) { //
      navigate("/profile", { replace: true });
    }
  }, [loading,           // changes in loading state triggers useEffect()
      isAuthenticated,   // makes sure to run redirect check only after "auth" state is udpated (or 'changes')
      location.pathname, // effect triggers when URL changes; ensures effect reacts to changes in the path
      navigate]);        // stable and unchanging like [dispatch], but included for linting best practices.



  
  if (loading) { // Mainly used to PREVENT flickering/rendering of login/register page 
                 // (whilst user is logged in) until actual redirected page('/profile') is fully loaded.
                 // Will replace this with a proper loading screen/spinner later.
    return ( 
      <div
        style={{
          fontSize: '2rem',
          fontWeight: 'Bold',
          textAlign: 'center'
        }}
      >
        Loading...
      </div>
    ); // Show some placeholder(like loading spinner or blank) until done
  }
  else {
    return ( /* <BasePageLayout> is the 'wrapper' that provides common page features for <PublicPageLayout> */
      <BasePageLayout>
        <Outlet /> {/* <Outlet /> is the page body setion where content changes based on current route! */}
      </BasePageLayout>
    );
  }
};

export default PublicPageLayout;
