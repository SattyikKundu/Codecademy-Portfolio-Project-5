
import { useLocation, useNavigate } from 'react-router-dom';

import './menuSearchTextBox.css';

const SearchTextBox = ({localInput, setLocalInput, setOverlayToggle}) => { // supporting component for handling search box
  
  const navigate = useNavigate();
  const location = useLocation();

  const resetSearch = () => {
    setLocalInput('');                          // clear text field in search bar    
    const pathWithoutQuery = location.pathname; // returns pathname WITHOUT '?search=param' from URL 
    navigate(pathWithoutQuery);                 // navigates to '/products/all' after '?search=param' removed
  }

  const handleSearch = () => { // passes search query into parameter and then navigate
    const trimmed = localInput.trim();
    if (trimmed) {
      navigate(`/products/all?search=${encodeURIComponent(trimmed)}`); // NOTE: encodeURIComponent() ensures 'trimmed' 
                                                                   // can be safely added as a path parameter inside URL
    }
    
    if (setOverlayToggle) {  // Automatically close overlay on mobile search submit
      setOverlayToggle(false);
    }

    window.scrollTo(0, 0);  // Manually scroll to top after submitting search
  }
    
  return (
    <div className="search-box-area">
          {/* '🗙' button to reset search on click */}  
      <button id='reset-search' onClick={resetSearch}>🗙</button>
      {/* Type in search input here */}
      <input
        className="search-input-box"
        onChange={(event) => setLocalInput(event.target.value)}
        type="text"
        value={localInput}
        placeholder="Enter Search Here..."
        onKeyDown={(event) => event.key === 'Enter' && handleSearch()} // Triggers search when user clicks ENTER
      />
      <button id='search-bttn' onClick={handleSearch}>🔍</button>
    </div>
  );
}

export default SearchTextBox;