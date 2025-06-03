
import {useState} from "react";      // track local states
import axios from "axios";                      // used to send HTTP requests to backend
import { useNavigate } from "react-router-dom"; // used to progammatically redirecting routes

import { ErrorMessageToast } from "../../utils/utilityFunctions";

import './RegisterPage.css';

const RegisterPage = () => {

    const navigate = useNavigate(); // initialize Navigate

    const [formData, setFormData] = useState({ // tracks form fields in 1 useState
        username: "",
        email: "",
        password:""
    });

    const [registering, setRegistering] = useState(false); // tracks if registering is ongoing
    const [header, setHeader]           = useState('Create Account'); // default header
    const [error, setError]             = useState(''); // track any backend error messages


    const handleChange = (event) => { // tracks form state (for all fields) as user types
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }
    
    const handleRegisterSubmit = async (event) => {// Handle registration form submission

        event.preventDefault(); // prevent page reload on submission
        setRegistering(true);   // registering starts now
        setError('');           // keep error empty

        try {
            const response = await axios.post(
                'http://localhost:5000/auth/register', // register route path
                formData,                              // form data sent to '/auth/register/' route in backend
                {withCredentials: true}                // if httpOnly cookie (with JWT) exists, send to backend
            );

            navigate(  // redirect to '/login' route after successful registration
                '/login', {state: {loginHeader: "Registration successful! You can login now!"} 
            });
            
        }
        catch (error) { // Handle registration failure
            const errorMsg = error.response?.data?.error || 'Registration failed.';
            setError(errorMsg);
            setHeader('Try again.');  
            ErrorMessageToast(errorMsg, 2500, 'top-center');
        }
        finally { // end of registering
            setRegistering(false);;
        }
    }

    const clickToLoginPage = () => { // navigate to login page (if already have account)
        navigate('/login');
    }

    return (
        <>
        <div className="registration-form">

            {/* Register form header */}
            <h2>
              {error && <span style={{ color: 'red', fontWeight: 'bold' }}>{error}. </span>}
              {header}
            </h2>

            {/* start of account registration form fields*/}
            <label>
                Username: 
                <input
                    type='text'                       // set input type
                    placeholder="Enter your username" // instruction text
                    name='username'
                    value={formData.username}         // holds 'username' value
                    onChange={handleChange}           // changes 'username' as typed
                    required                          // mandatory field
                />
            </label>
            <div className="form-divider"/>
            <label>
                Email:
                <input
                    type='text'                    // set input type
                    placeholder="Enter your email" // instruction text
                    name='email'
                    value={formData.email}         // holds 'username' value
                    onChange={handleChange}    // change password value on typing
                    required                       // makes field required
                />
            </label>            
            <div className="form-divider"/>
            <label>
                Password:
                <input
                    type='text'                       // set input type
                    placeholder="Enter your password" // instruction text
                    name='password'
                    value={formData.password}         // holds 'password' value
                    onChange={handleChange}           // change password value on typing
                    required                          // makes field required
                />
            </label>            
            <div className="form-divider"/>
            <button 
                className="register-button"
                type='submit'                   // state button is 'submit' type
                disabled={registering}          // disabled whilst registering
                onClick={handleRegisterSubmit} 
            >
                {registering ? "Registering account..." : "Register"}
            </button>

            {/* Google OAuth button placeholder (will update later!) */}
            <div className="register-button">Register/Login with Google</div>

            {/* Link for users who already have an account */}
            <p style={{cursor:'default'}}>Already have an account? <span
                    onClick={()=>clickToLoginPage()}
                    style={{
                        fontWeight:'bold',
                        cursor:'pointer'
                    }}
                >
                 Login here
                </span>
            </p>
        </div>
        </>
    );
}

export default RegisterPage;

