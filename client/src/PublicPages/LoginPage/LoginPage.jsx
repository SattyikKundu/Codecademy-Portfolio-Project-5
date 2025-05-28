import { useState } from "react"; // react hook to track form input
import { useNavigate } from "react-router-dom"; // hook for redirecting user after login
import { useDispatch } from "react-redux"; // Redux hook to update auth statement
import axios from 'axios'; // for making HTTP requests to backend

import { setUser } from "../../Slices/authSlice"; // redux action to store data

import './LoginPage.css';

const LoginPage = ({loginHeader="Log In Here"}) => { // login component with default login header message

    const dispatch = useDispatch(); // used to execute redux actions
    const navigate = useNavigate(); // used to progammatrically redirect user

    const [username, setUsername] = useState(''); // stores and track 'username' from form field and into local state
    const [password, setPassword] = useState(''); // stores and track 'passowrd' from form field and into local state

    const [error, setError]     = useState(''); // tracks login errors 
    const [loading, setLoading] = useState(''); // tracks loading state

    const handleLocalSubmit = async (event) => {

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
            navigate("/profile"); // now navigate to designated protected route after login
        }
        catch(error) { // handle error returned from backend (like invalid username or password)
            setError(error.response?.data?.error || 'Login failed.');
        }
        finally {
            setLoading(false); // turn off loading state at the end
        }
    }

    return (
        <>
        <div className="login-form-box">

            {/* Login form header */}
            <h2>{loginHeader}</h2>

            {/* start of login form */}
            <label>
                Username: 
                <input
                    type='text'         // set input type
                    value={username}    // holds 'username' value
                    onChange={          // changes 'username' as typed
                        (event) => setUsername(event.target.value)
                    }
                    required            // mandatory field
                />
            </label>
            <br />
            <label>
                Password:
                <input
                    type='text'             // set input type
                    value={password}        // set field value
                    onChange={              // change password value on typing
                        (event) => setPassword(event.target.value)
                    }
                    required                // makes field required
                />
            </label>            
            <br />
            <div 
                className="login-button"
                type='submit'      // state button is 'submit' type
                disabled={loading} // disabled whilst loading
                onClick={()=>handleLocalSubmit()}
            >
                {loading ? "Logging in..." : "Login"}
            </div>

            {/* Show error when login fails */}
            {error && <p style={{color:"red"}}>{error}</p>}

            {/* Google OAuth button placeholder (will update later!) */}
            <div className="login-button">
                Login with Google
            </div>
            <p>New User? Sign Up here</p>

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