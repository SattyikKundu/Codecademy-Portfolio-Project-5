import { useEffect, useState } from "react"; 
import {Outlet, Navigate} from "react-router-dom"; // <Outlet> is used to render nested child routes
                                                   // Navigate programatically redirects routes

import axios from "axios";                                       // sends HTTP client requests to backend
import {useDispatch, useSelector} from "react-redux";            // used for dispatching redux actions and tracking redux data
import {setUserFromToken, clearUser} from '../Slices/authSlice'; // redux action to track/update user state

import BasePageLayout from "./BasePageLayout/BasePageLayout"; // shared layout with header menu, cart slider, and toast messages

const ProtectedPageLayout = () => {

    const [checkingAuth, setCheckingAuth] = useState(true); // Tracks if still verifying user status
    const dispatch = useDispatch();                         // used to call redux actions

    const isAuthenticated = useSelector((state) =>  state.auth.isAuthenticated); // checks if user is authenticated

    const checkUserAuth = async () => {
        setCheckingAuth(true);
        try { // verify is user is authenticated
            const response = await axios.get( // Send GET request to '/auth/me' to verify JWT in cookie
                'http://localhost:5000/auth/me',
                 { withCredentials: true } // Ensure cookie is sent with request
            );

            if (response.data.user) {   // set user from token if valid response
                dispatch(setUserFromToken(response.data.user)); // If successful, dispatch user data to Redux store
            }
            else {                      // If invalid, clear user from redux
                dispatch(clearUser());     
            }
        } 
        catch(error) {  // If token fails (i.e. expired token), clear user from redux
            console.log("[checkUserAuth] Token invalid or missing: ", error);
            dispatch(clearUser()); 
        }
        finally {
            setCheckingAuth(false); // mark that checking authentication is finished
        }
    }

    /* NOTE: Below 2 useEffects may not be needed (verify later) */
    useEffect(() => { // Run (and re-run) the checkUserAuth() on mount and when 'dispatch' changes
        checkUserAuth();
    },[dispatch])

    useEffect(() => { // used to check if page is called from bfcache
      const handlePageShow = (event) => {
        if (event.persisted) {
          checkUserAuth(); //If so, call function to verify actual user authentication state
        }
      }
      window.addEventListener("pageshow", handlePageShow); 
      return () => {window.removeEventListener('pageshow', handlePageShow);} 
    }, []);
    


    if(checkingAuth) { // Set to 'Loading..' if user auth is being checked
        return (
        <h1        
          style={{
            fontSize: '2rem',
            fontWeight: 'Bold',
            margin: '100px auto auto auto'
          }}
        >
         Loading....
        </h1>);
    }

    if(!isAuthenticated) { // If user is unauthorized, redirect to login page 
        return (<Navigate to='/login' replace />); // Since user is unauthorized, 'replace' keyword prevents user from navigating back 
                                                   // to a protected page after redirect (since unauthorized user shouldn't be allowed to access it)
    }

    return ( // If successfully authenticated, reder the layout + any nested protected routes
        <BasePageLayout>
            <Outlet /> {/* Renders whichever protected route is matched inside <Routes> */}
        </BasePageLayout>
    );
}

export default ProtectedPageLayout; // Export the layout for use in routing