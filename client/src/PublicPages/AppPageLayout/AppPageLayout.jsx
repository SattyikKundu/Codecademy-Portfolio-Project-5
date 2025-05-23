import {useState, useEffect, useRef} from "react"; // import React library
import { Outlet, // <Outlet> injects content based on active route
         useLocation, // hook accesses object storing current location data (i.e pathname, query search, etc.)
         useNavigate  // useNavigate() navigates routes based on code (or 'programmatically')
        } from "react-router-dom"; 

import Menu from "../../PageComponents/menu/menu";
import CartSlider from "../../PageComponents/cartSlider/cartSlider";

import './AppPageLayout.css';

const AppPageLayout = () => {

    const [cartSliderOpen, setCartSliderOpen] = useState(false); // tracks when cart slider opens
    const toggleCart = () => { setCartSliderOpen(prev => !prev); }


    return (
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
        </div>
    );
}

export default AppPageLayout;