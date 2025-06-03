import { useState, useEffect } from "react";               // react hook to track form input
import { useNavigate } from "react-router-dom"; // hook for redirecting user after login
import { useDispatch } from "react-redux";      // Redux hook to update auth statement
import { useLocation } from "react-router-dom"; // hook for managing location object properties
import axios from 'axios';                      // for making HTTP requests to backend
import { ErrorMessageToast } from "../../utils/utilityFunctions"; // toast when login fails/succeed

import { setUser } from "../../Slices/authSlice"; // redux action to store data

import './LoginPage.css';

const LoginPage = () => { // login component with default login header message

    const dispatch = useDispatch(); // used to execute redux actions
    const navigate = useNavigate(); // used to progammatrically redirect user
    const location = useLocation(); // use to handle location 'state' passed via url

    const [username, setUsername] = useState(''); // stores and track 'username' from form field and into local state
    const [password, setPassword] = useState(''); // stores and track 'passowrd' from form field and into local state


    const [loading, setLoading] = useState(false);                                             // tracks loading state
    const [error,   setError] = useState(() => location.state?.loginErrorMsg || "");           // tracks error ('()=>' gets default value on mount)
    const [header,  setHeader] = useState(() => location.state?.loginHeader || "Log In Here"); // tracks header ('()=>' gets default value on mount)



    useEffect(() => { // used to clear 'red error' message from login header on page reload
    if (location.state?.loginErrorMsg || location.state?.loginHeader) {
        navigate(location.pathname, { replace: true }); // Clear the state after rendering once
    }
    }, [location, navigate]); 


    const handleLocalSubmit = async (event) => { // function for submitting login credentials locally

        event.preventDefault(); // prevents page reload on submit
        setLoading(true);
        setError('');

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
            navigate("/profile", { state: { loginSuccess: true } }); // now navigate to designated 
                                                                     // protected route after login
        }
        catch(error) { // handle error returned from backend (like invalid username or password)
            const errorMsg = error.response?.data?.error || 'Login failed.';
            setError(errorMsg);
            setHeader('Try again or register.');
            ErrorMessageToast(errorMsg, 2500, 'top-center');  // toast message with login error
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
        <div className="login-form-box">

            {/* Login form header */}
            <h2>
              {error && <span style={{ color: 'red', fontWeight: 'bold' }}>{error}. </span>}
              {header}
            </h2>

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
                <input
                    type='text'                  // set input type (needs to be 'password' in real-world apps to mask field!)
                    value={password}             // set field value
                    placeholder="Enter password" // instruction text
                    onChange={(event) => setPassword(event.target.value)}  // change password value on typing
                    required                     // makes field required
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

        </>
    );
}

export default LoginPage;