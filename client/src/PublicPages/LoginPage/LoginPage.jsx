import { useState, useEffect } from "react";               // react hook to track form input
import { useNavigate } from "react-router-dom"; // hook for redirecting user after login
import { useDispatch } from "react-redux";      // Redux hook to update auth statement
import { useLocation } from "react-router-dom"; // hook for managing location object properties
import axios from 'axios';                      // for making HTTP requests to backend
import { ErrorMessageToast, SuccessMessageToast } from "../../utils/utilityFunctions"; // toast when login fails/succeed

import { setUser } from "../../Slices/authSlice"; // redux action to store data
import { loadCartFromServer } from "../../Slices/cartSlice";
import FooterBottom from "../../PageComponents/footerBottom/footerBottom";
import PasswordInput from "../../PageComponents/loginRegisterPswdInput/passwordInput";

import './LoginPage.css';

const LoginPage = () => { // login component with default login header message

    const dispatch = useDispatch(); // used to execute redux actions
    const navigate = useNavigate(); // used to progammatrically redirect user
    const location = useLocation(); // use to handle location 'state' passed via url

    const [username, setUsername] = useState('');  // stores and track 'username' from form field and into local state
    const [password, setPassword] = useState('');  // stores and track 'passowrd' from form field and into local state
    const [loading,   setLoading] = useState(false); // tracks loading state


    const [header, setHeader] = useState(() => { // Set header on mount with below nested logic. Since all logic 
                                                 // is done in this useState(), text synchronization issues are prevented!

      const errorMsg    = location.state?.loginErrorMsg; // error message on login
      const successMsg  = location.state?.successMsg;    // notice of successful registration (redirect after regsitering on <RegisterPage />)
      const loginHeader = location.state?.loginHeader || "Log In Here."; // login header message (with default)

      if (errorMsg) { // if error message, set this header...
        return ( 
            <>
            <span style={{ color: 'red' }}>{errorMsg} </span>
            {loginHeader}
            </>
        );
      } 
      else if (successMsg) { // if success message, use this header...
        setTimeout(function() { SuccessMessageToast(successMsg, 1100, 'top-center')}, 400); // delay by 400ms
        return (
            <>
            <span style={{ color: 'green' }}>{successMsg} </span>
            {loginHeader}
            </>
        );
      } 
      else { // otherwise, return default header
        return loginHeader;
      }
    });


    useEffect(() => { // used to clear location.state on initial render (removes success/error messages)
        if(location.state){
            navigate(location.pathname, { replace: true }); // Clear the state after rendering once
        }
    }, [location, navigate]); 

    
    const handleLocalSubmit = async (event) => { // function for submitting login credentials locally

        event.preventDefault(); // prevents page reload on submit
        setLoading(true);       // start tracking loading

        try {
            const response = await axios.post(
                'http://localhost:5000/auth/login', // login endpoint (POST method)
                {username, password},               // post username and passport to '/auth/login' in authRoutes.js,
                                                    // which sends {username, passport} = req.body to userlogin() in authController.js

                {withCredentials: true}        // 'withCredientials: true' tells browser that if there's a cookie (i.e. JWT in a httpOnly cookie) tied to backend,     
                                               // it gets automatically added in request header when sending any HTTP request to backend.
                                               // This allows secure cross-origin authentication by 
                                               // letting the backend verify the JWT in httpOnly cookie from frontend.
            );

            dispatch(setUser(response.data.user)); // On success, dispatch user info to redux


            /****** sync cart on localStorage with the logged in user's cart in database ******/
            const localCart = JSON.parse(localStorage.getItem('cartState')) || { products: [] }; // get local Cart (or use 
                                                                                                 // placeholder if local cart empty)
            await axios.post( 
                'http://localhost:5000/cart/sync',
                localCart.products, // Sends localCart's 'products' array as part of req.body to backend.
                                    // Hence, the 'products' array is used as part of syncCartWithReduxState() in route.
                { withCredentials: true } // if cookie found in browser(frontend), it gets send to backend to be handled
            );

            localStorage.removeItem('cartState'); // clear 'cartState' from localStorage after syncing

            const cartResponse = await axios.get( // Now retrieve updated cart from database for logged in user
                'http://localhost:5000/cart',
                { withCredentials: true }
            );
            const backendCart = cartResponse.data.cartState.products;
            dispatch(loadCartFromServer(backendCart)); // dispatch updated cart to 'cart' redux store

            /*********** END of syncing cart on localStorage user's cart in database ***************/

            navigate("/profile", { state: { loginSuccess: true } }); // now navigate to designated 
                                                                     // protected route after login
                                                                     // 'loginSuccess' triggers toast in new page
        }
        catch(error) { // handle error returned from backend (like invalid username or password)
            const errorMsg = error.response?.data?.error || 'Login failed.';

            setHeader( // Directly set error message INTO header
              <>
                <span style={{ color: 'red' }}>{errorMsg} </span> Try again or register.
              </>
            );
            ErrorMessageToast(errorMsg, 1100, 'top-center');  // toast message with login error
        }
        finally {
            setLoading(false); // turn off loading state at the end
        }
    }

    const clickToRegisterPage = () => { // navigate to 'register' account
        navigate('/register');
    }

    return (
      <>  
      <div className="login-page-full" data-bg-var-repaint>
        <div className="login-form-box">

            {/* Login form header */}
            <h2>{header}</h2>

            {/* start of login form */}
            <label>
                Username: 
                <input
                    type='text'                    // set input type
                    value={username}               // holds 'username' value
                    placeholder="Enter username"   // instruction text
                    onChange={(event) => setUsername(event.target.value)} // changes 'username' as typed
                    required                       // mandatory field
                />
            </label>
            <br />   
            <label>
              Password:
              <PasswordInput
                value      ={password}                          // visible password in field as typed
                onChange   ={(event) => setPassword(event.target.value)} // updates password as typed
                name       ={"password"}                                 // input field name
                placeholder={"Enter password"}                           // placeholder for dield
              />
            </label>      
            <br />
            <button
                className="login-button"
                type='submit'      // state button is 'submit' type
                disabled={loading} // disabled whilst loading
                onClick={handleLocalSubmit}
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            {/* Google OAuth button placeholder (will update later!) */}
            <div className="login-button">Login with Google</div>

            {/* Link for new users who need to register for an account */}
            <p style={{cursor:'default'}}>New User? <span
                    onClick={()=>clickToRegisterPage()}
                    style={{
                        fontWeight:'bold',
                        cursor:'pointer'
                    }}
                >
                Sign Up here
                </span>
            </p>

                {/*     
                    <button onClick={() => window.location.href = "http://localhost:5000/auth/google"}>
                        Login with Google
                    </button>
                    <p>(Google login not functional yet — backend config pending)</p> 
                */}
        </div>
      <FooterBottom />
      </div>
      </>
    );
}

export default LoginPage;