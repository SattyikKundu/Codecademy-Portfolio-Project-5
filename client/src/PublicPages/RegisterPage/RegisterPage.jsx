
import React, {useState} from "react"; // track local states
import axios from "axios";             // used to send HTTP requests to backend
import { useNavigate } from "react-router-dom"; // used to progammatically redirecting routes

import './RegisterPage.css';

const RegisterPage = () => {

    const navigate = useNavigate(); // initialize Navigate

    const [formData, setFormData] = useState({ // tracks form fields in 1 useState
        username: "",
        email: "",
        password:""
    });

    const [registering, setRegistering] = useState(''); // tracks if registering is ongoing
    const [error, setError]             = useState(''); // track any backend error messages

    const handleChange = (event) => { // tracks form state (for all fields) as user types
        setFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }

    // Handle registration form submission
    const handleRegisterSubmit = async (event) => {
        event.preventDefault(); // prevent page reload on submission
        setRegistering(true);   // registering starts now
        setError('');           // keep error empty

        try {
            const response = await axios.post(
                'http://localhost:5000/auth/register', // register route path
                formData,                              // form data sent to '/auth/register/' route in backend
                {withCredentials: true}                // if httpOnly cookie (with JWT) exists, send to backend
            );

            // redirect to '/login' route after successful registration
            navigate('/login', {state: {loginHeader: "Registration successful! You can login now!"} });
            
        }
        catch (error) { // Handle registration failure
            setError(error.response?.data?.error || 'Registration failed. Please try again.');
            
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
            <h2>Create Account</h2>

            {/* start of account registration form fields*/}
            <label>
                Username: 
                <input
                    type='text'                       // set input type
                    placeholder="Enter your username" // instruction text
                    value={formData.username}         // holds 'username' value
                    onChange={()=>handleChange()}     // changes 'username' as typed
                    required                          // mandatory field
                />
            </label>
            <div className="form-divider"/>
            <label>
                Email:
                <input
                    type='text'                    // set input type
                    placeholder="Enter your email" // instruction text
                    value={formData.email}         // holds 'username' value
                    onChange={()=>handleChange()}  // change password value on typing
                    required                       // makes field required
                />
            </label>            
            <div className="form-divider"/>
            <label>
                Password:
                <input
                    type='text'                       // set input type
                    placeholder="Enter your password" // instruction text
                    value={formData.password}         // holds 'password' value
                    onChange={()=>handleChange()}     // change password value on typing
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

            {/* Show error if account registration fails */}
            {error && <p style={{color:"red"}}>{error}</p>}

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

