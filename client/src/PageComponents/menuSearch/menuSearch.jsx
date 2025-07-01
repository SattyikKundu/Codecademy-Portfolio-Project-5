import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // used to import FontAwesomeIcons
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import SearchTextBox from './menuSearchTextBox.jsx';

import './menuSearch.css';

const MenuSearch = ({ localInput, setLocalInput }) => { // component for handling all searches in menu
 

  const [overlayToggle, setOverlayToggle] = useState(false); // tracks when to toggle open/close overlay

  const toggleOverlay = () => { // togglesOverlay
    setOverlayToggle(prev => !prev);
  }

  useEffect(() => { // useEffect to handle toggling off overlay is screen width exceeds 690px

    const checkScreenWidth = () => {
      if(window.innerWidth >= 690) { // check if window/viewport width is at least 690px...
        setOverlayToggle(false); // On >=690px width, overlay becomes closed
      }
      /* NOTE: If I needed to check the height/width of a DOM object (<div>) instead of 
       *       the screen window, I would need to use a useRef object 
       */
    }

    addEventListener('resize', checkScreenWidth); // Add listener event for when screen resizes

    checkScreenWidth();// call checkScreenWidth() function (on mount)

    return () => { // clean up listener during component unmount
      window.removeEventListener('resize', checkScreenWidth); // removes function associated with 'resize'
    }
  },[]) // empty [] ensures effect starts running on mount

  return (
    <>
      {/* Used to provide a search-box overlay when mobile screen is too small. (<540px) */}
      <div className="search-toggle-container" onClick={toggleOverlay}>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon"/>
      </div>
      {
        (overlayToggle) && ( // if toggle is TRUE, show overlay
          <div className="search-overlay-background" >
            <div className="search-overlay-main">
              <SearchTextBox 
                localInput      ={localInput} 
                setLocalInput   ={setLocalInput} 
                setOverlayToggle={setOverlayToggle} // passes function so 'search' overlay can close on submitting search
              />
              <button className='close-overlay' onClick={toggleOverlay}>🗙</button>
            </div>
          </div>
        )
      }
      {/* Used to show search text box when screen size is tablet and desktop sized. (>=540px) */}
      <div className="text-box-wrapper">
        <SearchTextBox localInput={localInput} setLocalInput={setLocalInput} />
      </div>
    </>
  );
}

export default MenuSearch;