import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
