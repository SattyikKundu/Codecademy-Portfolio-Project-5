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

    /* drop-down menu option styling colors (for mobile screen sizes) */
    const selectedBG   = '#2394e0'; // background color of selected option 
    const unSelectedBG = 'transparent'; // background color of unselected option
    const selectedFG   = '#fff';        // text color (or 'foreground color') of selected option
    const unSelectedFG = '#000';        // text color of unselected option

    /* Colors of category buttons (when selected/unselected) for desktop screen sizes */
    const textColor         = '#fff';     // button text color (white)
    const selectBttnColor   = '#136196';  // button color (or 'foreground color') when selected
    const unSelectBttnColor = '#2394e0';  // button color when unselected

    /* Categories' names */
    const category1 = 'All';
    const category2 = 'Fishes';
    const category3 = 'Invertebrates';
    const category4 = 'Corals & Anemones';

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
                        onClick={()=>selectOption(`${category1}`)} 
                        style={{ // option's text and background color changes depending on selection (or not)
                            backgroundColor: selected===`${category1}` ? `${selectedBG}` : `${unSelectedBG}`,
                                      color: selected===`${category1}` ? `${selectedFG}` : `${unSelectedFG}`
                        }}
                    >
                        {category1}
                    </div>
                    <div className="menu-options-divider" />
                    <div 
                        className="option"
                        onClick={()=>selectOption(`${category2}`)}
                        style={{
                            backgroundColor: selected===`${category2}` ? `${selectedBG}`: `${unSelectedBG}`,
                                      color: selected===`${category2}` ? `${selectedFG}`: `${unSelectedFG}`
                        }}
                    >
                        {category2}
                    </div>
                    <div className="menu-options-divider" />
                    <div 
                        className="option"
                        onClick={()=>selectOption(`${category3}`)}
                        style={{
                            backgroundColor: selected===`${category3}` ? `${selectedBG}`: `${unSelectedBG}`,
                                      color: selected===`${category3}` ? `${selectedFG}`: `${unSelectedFG}`
                        }}
                    >
                        {category3}
                    </div>
                    <div className="menu-options-divider" />
                    <div
                        className="option" 
                        onClick={()=>selectOption(`${category4}`)}
                        style={{
                            backgroundColor: selected===`${category4}` ? `${selectedBG}`: `${unSelectedBG}`,
                                      color: selected===`${category4}` ? `${selectedFG}`: `${unSelectedFG}`
                        }}
                    >
                        {category4}
                    </div>
                </div>
                )
            }
        </div>
        {/* Categories button for desktop screen sizes */}
        <div className="buttons-container">
            <div className="button" 
                onClick={()=>selectOption(category1)}
                style={{
                    // button color changes depending if selected or not (synchronized with dropdown box)
                    backgroundColor: selected===`${category1}` ? `${selectBttnColor}`: `${unSelectBttnColor}`,
                              color: `${textColor}`
                }}>
                {category1}</div>
            <div className="button" 
                onClick={()=>selectOption(category2)}
                style={{
                    backgroundColor: selected===`${category2}` ? `${selectBttnColor}`: `${unSelectBttnColor}`,
                              color: `${textColor}`
                }}>
                {category2}</div>
            <div className="button" 
                onClick={()=>selectOption(category3)}
                style={{
                    backgroundColor: selected===`${category3}` ? `${selectBttnColor}`: `${unSelectBttnColor}`,
                              color: `${textColor}`
                }}>
                {category3}</div>
            <div className="button" 
                onClick={()=>selectOption(category4)}
                style={{
                    backgroundColor: selected===`${category4}` ? `${selectBttnColor}`: `${unSelectBttnColor}`,
                              color: `${textColor}`
                }}>
                {category4}</div>
        </div>
        </>
    );
}

export default CategoryButtons;