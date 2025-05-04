import React, { useState } from "react";

import './menuSearchBox.css';

const SearchBar = () => {

    const [localInput, setLocalInput] = useState('');

    const resetSearch = () => { // resets search text in text-box
        setLocalInput('');
    }

    return (
      <div className="search-box-area">
        <button
            id='reset-search'
            onClick={resetSearch}
        >
            🗙
        </button>
        <input
          className="search-input-box"
          onChange={(event) => setLocalInput(event.target.value)}
          type="text"
          value={localInput}
          placeholder="Enter Search Here..."
        />
        <button 
          id='search-bttn'
       //   type="button"  
       //   onClick={handleSubmit}
        >
          🔍
        </button>
      </div>
    );
};

export default SearchBar;

