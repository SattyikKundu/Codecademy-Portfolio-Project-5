import React, { useState, useEffect, useRef} from "react";

import './menuCategories.css';

const CategoryButtons = () => {
    //console.log("Category Buttons rendered");

    const [menuOpen, setMenuOpen] = useState(false); // tracks when dropdown menu is open or closed
    const [selected, setSelected] = useState('All'); // tracks selection choice from dropdown menu

    const dropDownRef= useRef(null); // used for reference to dropdown menu when detecting 
                                     // clicks outside dropdown menu via useEffect()

    const openMenu = () => { // toggles opening/closing of dropdown menu
        setMenuOpen(prev => !prev);
    }
    const selectOption = (text) =>{ // set selected option from drop-down menu
        setSelected(text);
        setMenuOpen(false); // close dropdown upon selection
    } 

    useEffect(()=>{
        const handleOutsideClick = (event) => {
            if(dropDownRef.current  // <== checks if the referred dropdown <div> exists
                && !dropDownRef.current.contains(event.target) //<== First checks if the dropdown <div> contains the click event (target).
                                                               //    Then the negation(!) makes it so the condition is that the click event 
                                                               //    takes place outside of selected dropDownRef.
            ) {
                setMenuOpen(false); // close menu
            };
        }

        document.addEventListener('mousedown', handleOutsideClick); // attaches method of 'mousedown' (or click) event

        return () => { // Cleans up event listener when component remounts or dismounts
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    },[]) // runs once on component mount

    /* drop-down menu option styling colors */
    const selectedBG   = '#2394e0'; // background color of selected option 
    const unSelectedBG = 'transparent'; // background color of unselected option
    const selectedFG   = '#fff';        // text color (or 'foreground color') of selected option
    const unSelectedFG = '#000';        // text color of unselected option

    return (
        <>
        {/* Category selection drop-down menu for mobile screen sizes */}
        <div className="custom-dropdown" ref={dropDownRef}>
            <div className="dropdown-box" onClick={openMenu}>
                <div className="current-selection">{selected}</div>
                <div className="toggle-arrow"> {menuOpen ? '▲' : '▼'} </div>
            </div>
            { menuOpen && (
                <div className="menu-options">
                    <div 
                        className="option"
                        onClick={()=>selectOption('All')} 
                        style={{ // option's text and background color changes depending on selection (or not)
                            backgroundColor: selected==='All' ? `${selectedBG}` : `${unSelectedBG}`,
                                      color: selected==='All' ? `${selectedFG}` : `${unSelectedFG}`
                        }}
                    >
                        All
                    </div>
                    <div 
                        className="option"
                        onClick={()=>selectOption('Category1')}
                        style={{
                            backgroundColor: selected==='Category1' ? `${selectedBG}`: `${unSelectedBG}`,
                                      color: selected==='Category1' ? `${selectedFG}`: `${unSelectedFG}`
                        }}
                    >
                        Category1
                    </div>
                    <div 
                        className="option"
                        onClick={()=>selectOption('Category2')}
                        style={{
                            backgroundColor: selected==='Category2' ? `${selectedBG}`: `${unSelectedBG}`,
                                      color: selected==='Category2' ? `${selectedFG}`: `${unSelectedFG}`
                        }}
                    >
                        Category2
                    </div>
                    <div
                        className="option" 
                        onClick={()=>selectOption('Category3')}
                        style={{
                            backgroundColor: selected==='Category3' ? `${selectedBG}`: `${unSelectedBG}`,
                                      color: selected==='Category3' ? `${selectedFG}`: `${unSelectedFG}`
                        }}
                    >
                        Category3
                    </div>
                </div>
                )
            }
        </div>
        {/* Categories button for desktop screen sizes */}
        <div className="buttons-container">
            <div className="button">All</div>
            <div className="button">Category1</div>
            <div className="button">Category2</div>
            <div className="button">Category3</div>
        </div>
        </>
    );
}

export default CategoryButtons;