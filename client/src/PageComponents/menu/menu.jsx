import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faFishFins } from '@fortawesome/free-solid-svg-icons';


import CategoryButtons from "../menuCategories/menuCategories.jsx";
import MenuSearch      from "../menuSearch/menuSearch.jsx";
import AboutPageButton from '../menuAbout/menuAbout.jsx';
import ProfileButton   from "../menuUserProfile/menuUserProfile.jsx";
import CartButton      from "../menuCartBttn/menuCartBttn.jsx";

import { useState } from 'react';

import './menu.css';

const Menu = ({toggleCart}) => {

    const [searchInput, setSearchInput] = useState(''); // tracks the local input from search bar

    return (
        <div className="header-menu">
          <div className="logo-container">
            <div className="icon-container">
              <FontAwesomeIcon icon={faFishFins} className="fish-icon" />
            </div>
            <span id="store-name">Reef</span>
          </div>
    
          <CategoryButtons 
            clearSearchBar={() => setSearchInput('')}  // 
          />
          <MenuSearch 
            localInput={searchInput}        // passes stores searchInput as localInput for text in search bar
            setLocalInput={setSearchInput}  // stores search input via typing (or resetting via resetSearch())
          />
          {/* About button */}
          <AboutPageButton />

          <ProfileButton />
          <CartButton
            toggleCart={toggleCart}
          />
        </div>
    );
}

export default Menu;