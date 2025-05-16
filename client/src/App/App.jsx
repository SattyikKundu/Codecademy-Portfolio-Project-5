import React, {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Menu from "../PageComponents/menu/menu";
import CartSlider from "../PageComponents/cart/cart"; //...

import './App.css';


const App = () => {

    console.log("App rendered");

    const [cartSliderOpen, setCartSliderOpen] = useState(false); // tracks when cart slider opens
    const toggleCart = () => { setCartSliderOpen(prev => !prev);}

    return (
        <div className="app-body">
          {/* Menu and CarSlider is always constant across all pages */}
            <Menu
              toggleCart={toggleCart}//..
            />
            <h1>To Be Added Later...</h1>
            <CartSlider 
              toggleCart={toggleCart}
              cartSliderOpen={cartSliderOpen} 
            /> 
          {/* Below Main content body changes due to routes */}

        </div>
    );
}
export default App;