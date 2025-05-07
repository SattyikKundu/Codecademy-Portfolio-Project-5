import React, {useState} from "react";

import Menu from "../components/menu/menu.jsx";

import CartSlider from "../components/cart/cart.jsx"; //...

import './App.css';


const App = () => {

    console.log("App rendered");

    const [cartSliderOpen, setCartSliderOpen] = useState(false); // tracks when cart slider opens
    const toggleCart = () => { setCartSliderOpen(prev => !prev);}

    return (
        <div className="app-body">
            <Menu
              toggleCart={toggleCart}//..
            />
            <h1>To Be Added Later...</h1>
            {
            <CartSlider 
              toggleCart={toggleCart}
              cartSliderOpen={cartSliderOpen} 
            /> 
            }
        </div>
    );
}
export default App;