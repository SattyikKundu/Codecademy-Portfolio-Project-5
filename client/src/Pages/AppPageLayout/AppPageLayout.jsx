import React, {useState} from "react"; // import React library
import { Outlet } from "react-router-dom"; // <Outlet> injects content based on active route

import Menu from "../../PageComponents/menu/menu";
import CartSlider from "../../PageComponents/cart/cart";

import './AppPageLayout.css';

const AppPageLayout = () => {

    const [cartSliderOpen, setCartSliderOpen] = useState(false); // tracks when cart slider opens
    const toggleCart = () => { setCartSliderOpen(prev => !prev);}

    return (
        <div className="app-body">
            {console.log('Inside "return" of UniversalPageLayout ')}
            <Menu
              toggleCart={toggleCart}//..
            />
            <CartSlider 
              toggleCart={toggleCart}
              cartSliderOpen={cartSliderOpen} 
            /> 
            {/* <Outlet /> is the main page body where content changes based on current route */}
            <Outlet/>
        </div>
    );
}

export default AppPageLayout;