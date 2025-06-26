import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

/* NOTE: This component is used to get new pages to 
 *       automatically start from the top on each render.
 *       A notable issue was that when the previous page
 *       was scrolled down at bottom, the next page ALSO
 *       started from the bottom (as in the same scroll position)
 *       like in the previous page. This component aims to
 *       resolve the issue.
 */

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top if path is different/new from previous page/route.
      window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;


/* BELOW VERSION: HOWEVER, when user goes back to previous routes 
 *                (like using back button), user will be on last scroll area
 *                on previous page if user needs to be back in the same area again.
 */


/*
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPath = useRef(null);

  useEffect(() => {
    // Only scroll to top if path is different/new from previous page/route.
    if(prevPath.current !== pathname){  
      window.scrollTo(0, 0);
    }
    prevPath.current = pathname;
  }, [pathname]);

  return null;
};

export default ScrollToTop;
*/