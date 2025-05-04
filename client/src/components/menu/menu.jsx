import React from "react";

import CategoryButtons from '../menuCategories/menuCategories.jsx';
import SearchBar from "../menuSearchBox/menuSearchBox.jsx";

import './menu.css';

const Menu = () => {
    //console.log("Menu rendered");
    return (
        <div className="header-menu">
            <div className="logo-text">Canned Goodies</div>
            <CategoryButtons/>
            <SearchBar />
        </div>
    );
}

export default Menu;