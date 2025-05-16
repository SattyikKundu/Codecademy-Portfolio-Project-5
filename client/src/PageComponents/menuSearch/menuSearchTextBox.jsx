import React from 'react';

import './menuSearchTextBox.css';

const SearchTextBox = ({localInput, setLocalInput}) => { // supporting component for handling search box
    
      const resetSearch = () => { // resets search text in text-box
          setLocalInput('');
      }
    
      return (
        <div className="search-box-area">
          {/* '🗙' button to reset search on click */}  
          <button
              id='reset-search'
              onClick={resetSearch}
          >
              🗙
          </button>
          {/* Type in search input here */}
          <input
            className="search-input-box"
            onChange={(event) => setLocalInput(event.target.value)}
            type="text"
            value={localInput}
            placeholder="Enter Search Here..."
          />
          <button 
            id='search-bttn'
          >
            🔍
          </button>
        </div>
      );
}

export default SearchTextBox;