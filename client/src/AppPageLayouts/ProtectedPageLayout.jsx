import { 
    useEffect, // react hook for side effects
    useState   // react hook for state tracking
    } from "react"; 

import { 
    Outlet,  // <Outlet> is used to render nested child routes
    Navigate // Navigate programatically redirects routes
    } from "react-router-dom"; 

import axios from "axios"; // sends HTTP client requests to backend
import { useDispatch } from "react-redux"; // hook for dispatching redux actions

import {setUserFromToken, clearUser} from '../Slices/authSlice'; // redux action to track/update user state

import BasePageLayout from "./BasePageLayout/BasePageLayout"; // shared layout with header menu, cart slider, and toast messages

const ProtectedPageLayout = () => {

    const [checkingAuth, setCheckingAuth] = useState(true); // Tracks if still verifying user status
    const [authorized, setAuthorized] = useState(false);    // Tracks if user is authenticated
    const dispatch = useDispatch();                         // used to call redux actions

    const checkUserAuth = async () => {
        try {
            // Send GET request to '/auth/me' to verify JWT in cookie
            const response = await axios.get(
                'http://localhost:5000/auth/me',
                 { withCredentials: true } // Ensure cookie is sent with request
            );
            dispatch(setUserFromToken(response.data.user)); // If successful, dispatch user data to Redux store

            setAuthorized(true); // set user as authorized
        } 
        catch(error) {             // If token fails (i.e. expired token)...
            dispatch(clearUser()); // clear redux auth state
            setAuthorized(false);  //  and deny authorization
        }
        finally {
            setCheckingAuth(false); // mark that checking authentication is finished
        }
    }
    
    useEffect(() => { // Run (and re-run) the checkUserAuth() on mount and when 'dispatch' changes
        checkUserAuth();
    },[dispatch])

    if(checkingAuth) { // Set to 'Loading..' if user auth is being checked
        return (<h1>Loading....</h1>);
    }
    if(!authorized) { // If user is unauthorized, navigate to login page 

        return (<Navigate to='/login' replace />); // Since user is unauthorized, 'replace' keyword prevents user from navigating back 
                                                   // to a protected page after redirect (since unauthorized user shouldn't be allowed to access it)
    }

    return ( // If successfully authenticated, reder the layout + any nested protected routes
        <BasePageLayout>
            <Outlet />
        </BasePageLayout>
    );
}

export default ProtectedPageLayout; // Export the layout for use in routing
