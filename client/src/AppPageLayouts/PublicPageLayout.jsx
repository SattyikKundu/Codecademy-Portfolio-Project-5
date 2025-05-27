import { Outlet } from "react-router-dom"; // <Outlet> injects content based on active route
import BasePageLayout from './BasePageLayout/BasePageLayout'; // imports 'wrapper' layout for common page features

const PublicPageLayout = () => {

  return (
    // <BasePageLayout> is the 'wrapper' that provided common page features for the <PublicPageLayout> 
    <BasePageLayout>
        
      {/* <Outlet /> is the page body setion where content changes based on current route! */}
      <Outlet />

    </BasePageLayout>
  );
};

export default PublicPageLayout;