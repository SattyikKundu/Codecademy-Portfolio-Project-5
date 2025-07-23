import { PulseLoader } from "react-spinners"; // react-spinner to show 'loading state
import { useState, useEffect } from "react";
import './pageLoadingNotice.css';

/*  Currently, Loading spinner is only created for the Products 
 *  Page since that's the home page. This components will later
 *  be adjusted to be properly placed in the other pages.
 */
const PageLoadingNotice = ({loadingText = 'Loading...'}) => { 

  const [loadingSize, setLoadingSize] = useState(110); // set dynamic loading size of  <PulseLoader /> component
  
  useEffect(() => { // useEffect for shrinking "loader" at under 520px;
    const updateLoaderSize = () => { // listener function 
        const width = window.innerWidth; // get current viewport/window width
  
        if (width >= 520) { setLoadingSize(110); } 
        else if (width < 520) { setLoadingSize(85); } 
        else if (width < 360) { setLoadingSize(50); }
    };

    updateLoaderSize(); // Set function on mount
    window.addEventListener("resize", updateLoaderSize); // "Listen" to screen size changes
    return () => window.removeEventListener("resize", updateLoaderSize); // remove listerner on un-mount

  }, []);

  return (
    <>
      <div className="products-loading-notice">
        <div id='loading-notice-text'>{loadingText}</div>
        <PulseLoader size={loadingSize} color={'#797979'} />
      </div>
    </>
  );
}

export default PageLoadingNotice;

