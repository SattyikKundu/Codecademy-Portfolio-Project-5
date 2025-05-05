import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faFishFins } from '@fortawesome/free-solid-svg-icons';

import CategoryButtons from '../menuCategories/menuCategories.jsx';
import SearchBar from "../menuSearchBox/menuSearchBox.jsx";
import ProfileButton from "../menuUserProfile/menuUserProfile.jsx";
import CartButton from "../menuCartBttn/menuCartBttn.jsx";

import './menu.css';

const Menu = () => {
    //console.log("Menu rendered");
    return (
        <div className="header-menu">
          <div className="logo-container">
            <div className="icon-container">
              <FontAwesomeIcon icon={faFishFins} className="fish-icon" />
            </div>
            <span id="store-name">Reef</span>
          </div>
          <CategoryButtons />
          <SearchBar />
          <ProfileButton />
          <CartButton />
        </div>
    );
}

export default Menu;