import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../Slices/authSlice";


import { Outlet } from "react-router-dom"; // <Outlet> injects content based on active route
import BasePageLayout from './BasePageLayout/BasePageLayout'; // imports 'wrapper' layout for common page features

const PublicPageLayout = () => {

  const dispatch = useDispatch(); // initialize dispatch to use redux slices

  const checkUserSession = async () => { // function to check user session
    try {
      const response = await axios.get(
        'http://localhost:5000/auth/me', // accesses route that verifies if user is 
                                         // logged in (via checking for httpOnly cookie with JWT token)
        {withCredentials: true}          // ensures cookie is sent with request
      );
      if(response.data.user) { // if user data found/obtained
        dispatch(setUser(response.data.user));
      }
    }
    catch(error) { // log error
      console.log("User isn't logged in nor is there a valid cookie: ",error);
    }
  }

  useEffect(() => { // On mount (or 'dispatch' dependency change), check for existing user session.
    checkUserSession();
  },[dispatch]); 



  return (
    // <BasePageLayout> is the 'wrapper' that provided common page features for the <PublicPageLayout> 
    <BasePageLayout>
        
      {/* <Outlet /> is the page body setion where content changes based on current route! */}
      <Outlet />

    </BasePageLayout>
  );
};

export default PublicPageLayout;