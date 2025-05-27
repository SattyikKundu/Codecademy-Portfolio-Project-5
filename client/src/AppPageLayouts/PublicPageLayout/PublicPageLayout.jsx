import {useState, useEffect, useRef} from "react"; // import React library
import { Outlet, // <Outlet> injects content based on active route
         useLocation, // hook accesses object storing current location data (i.e pathname, query search, etc.)
         useNavigate  // useNavigate() navigates routes based on code (or 'programmatically')
        } from "react-router-dom"; 

import { Toaster, toast } from 'react-hot-toast'; // enable toast messaages to open in app page

import Menu from "../../PageComponents/menu/menu";
import CartSlider from "../../PageComponents/cartSlider/cartSlider";

import './PublicPageLayout.css';

const PublicPageLayout = () => {

    const [cartSliderOpen, setCartSliderOpen] = useState(false); // tracks when cart slider opens
    const toggleCart = () => { setCartSliderOpen(prev => !prev); }

    const [toastOffset,   setToastOffset]   = useState({ top: 70, right: 10 }); // states to handle offsets of toast
    const [toastPosition, setToastPosition] = useState('top-right');
    toast.limit = 2; // allow most 2 'toasts' to stack at once

    /* Note: see "../PageComponents/.../productCard.jsx" and "../utils/"" for custom toast functions */

    return (
      <>
        <div className="app-body">
            {console.log('Inside "return" of UniversalPageLayout ')}
            <Menu
              toggleCart={toggleCart}
            />
            <CartSlider 
              toggleCart={toggleCart}
              cartSliderOpen={cartSliderOpen} 
            /> 
            {/* <Outlet /> is the main page body where content changes based on current route! */}
            <Outlet/>

            {/* Create <Toaster /> for toast messages with  */}
            <Toaster position={toastPosition} containerStyle={toastOffset}/>
        </div>
        </>
    );
}

export default PublicPageLayout;