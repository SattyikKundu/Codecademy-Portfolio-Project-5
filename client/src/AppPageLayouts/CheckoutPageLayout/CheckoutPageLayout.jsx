import { useState, useEffect } from "react"; // import React library
import { Toaster, toast, useToasterStore } from 'react-hot-toast'; // enable toast messaages to open in all app 
                                                                   // routes within this layout. Without <Toaster />,
                                                                   // toast messages will silently fail and won't show

import { Outlet, Navigate } from "react-router-dom"; // <Outlet> is used to render nested child routes
                                                     // Navigate programatically redirects routes

import axios from "axios"; // sends HTTP client requests to backend
import {useDispatch, useSelector} from "react-redux"; // used for dispatching redux actions and tracking redux data
import {setUserFromToken, clearUser} from  '../../Slices/authSlice'; // redux action to track/update user state

import { Elements } from '@stripe/react-stripe-js'; // imports for Stripe
import { loadStripe } from '@stripe/stripe-js';

import FooterBottom from "../../PageComponents/footerBottom/footerBottom";

import './CheckoutPageLayout.css';

/* <CheckoutPageLayout> is a separate layout from the others
 * in order to exclusively hold the CheckoutPage.jsx. It also
 * doesn't have menu and cart slider found in the BasePageLayout.jsx
 * in order to FULLY streamline the customer's focus on the checkout
 * process. 
 * 
 * By the way, since checkout should ONLY be visible to logged in 
 * users, this page layout will have authentication handling.
 */


// Import stripe public key in .env file. Needs to be OUTSIDE 
// component so it can ONLY be called once globally.
// This also prevents creating multiple Stripe instances that can lead 
// to an error leading to a break between Stripe Elements and API calls.  
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); 

const CheckoutPageLayout = () => {

    /*************************************************************************************/
    /************************* Below handles toasts **************************************/
    /*************************************************************************************/
    const { toasts } = useToasterStore(); // used to manage toast State
    const TOAST_LIMIT = 1;                // Limits to 1 toast per sandwich

    useEffect(() => { // useEffect() that dismisses last toast when added new toast exceeds TOAST_LIMIT.
                      // essentially prevent too many toasts to 'sandiwich' due to rapid clicks.
        toasts
            .filter((selectedToast) => selectedToast.visible)           // Only consider visible toasts
            .filter((_, index) => index >= TOAST_LIMIT)                 // Is toast index over limit?
            .forEach((currentToast) => toast.dismiss(currentToast.id)); // Dismiss
    }, [toasts]);


    /*************************************************************************************/
    /************* Below hooks and functions handle authentication checking **************/
    /*************************************************************************************/

    const [checkingAuth, setCheckingAuth] = useState(true); // Tracks if still verifying user status
    const dispatch = useDispatch();                         // used to call redux actions

    const isAuthenticated = useSelector((state) =>  state.auth.isAuthenticated); // checks if user is authenticated

    const checkingUserAuth = async () => {
      try { // verify is user is authenticated (if user is already authenticated, "loading state" can still end)

        if(!isAuthenticated) { // If user already authenticated, skip this step
        
            const response = await axios.get( // Send GET request to '/auth/me' to verify JWT in cookie
                //'http://localhost:5000/auth/me',
                `${process.env.VITE_API_BASE_URL}/auth/me`,
                 { withCredentials: true } // Ensure cookie is sent with request
            );

            if (response.data.user) {
                dispatch(setUserFromToken(response.data.user)); // If successful, dispatch user data to Redux store
            } else {
                dispatch(clearUser());   
            }
        } 
      }
      catch(error) {  // If token fails (i.e. expired token), clear user from redux
        dispatch(clearUser()); 
      }
      finally {
        setCheckingAuth(false); // mark that checking authentication is finished
      }
    }
    
    useEffect(() => { // Run (and re-run) the checkUserAuth() on mount and when 'dispatch' changes
        checkingUserAuth();
    },[dispatch])


    if(checkingAuth) { // Set to "loading state" if user auth is being checked
        return (<h1 style={{marginTop: '3rem'}}>Loading payment gateway...</h1>);
    }

    if(!isAuthenticated) { // If user is unauthorized, redirect to login page (since 'guests' cannot access checkout)
        return (<Navigate 
                    to='/login' 
                    state={{ 
                        loginErrorMsg: "Login Required:", 
                        loginHeader: "Please login (or register first) to access checkout."
                    }} 
                    replace />); // Since user is unauthorized, 'replace' keyword prevents user from navigating back 
                                                   // to a protected page after redirect (since unauthorized user shouldn't be allowed to access it)
    }

    return (
        <>
        <div className="checkout-body">

            {/* <Outlet/> where content is injected based on chosen route */}
            <Elements stripe={stripePromise}>
                <Outlet />
            </Elements>

            {/* Default <Toaster /> for toast messages */}
            <Toaster position={'top-center'} containerStyle={{ top: 44 }} /> 
        
        <FooterBottom/>
        </div>
        </>
    );
}

export default CheckoutPageLayout;