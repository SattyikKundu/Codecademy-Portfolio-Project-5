
// /* Custom hook for checking of whether user is
//  * logged in (or authenticated).
//  */

// //imported hooks
// import { useEffect } from "react"; 
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { setUser, clearUser } from "../Slices/authSlice";


// const checkUserAuthentication = () => {

//     const dispatch = useDispatch(); // used to dispatch actions from 

//     useEffect(() => {
//         const checkUserSession = async () => {
//             try {
//                 const response = await axios.get(
//                     'http://localhost:5000/auth/me', // Send GET request to 'auth/me' route in backend to verify
//                                                      // if user is logged in (via checking for JWT in httpOnly cookie).
//                     {withCredentials: true}// esures cookie is sent with request
//                 );

//                 if(response.data.user) { // check if user in session before storing it in 'auth' slice of redux store
//                     dispatch(setUser(response.data.user));
//                 }
//             }
//             catch(error) {
//                 console.log('Session/auth data not found: ',error);
//                 dispatch(clearUser()); // remove faulty user data if there's any...
//             }
//         };

//         checkUserSession();
//     },[dispatch]);

// }

// export default checkUserAuthentication;