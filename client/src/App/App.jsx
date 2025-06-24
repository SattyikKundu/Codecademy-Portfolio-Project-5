import { BrowserRouter as Router,  // provides routing functionality via browser's history API
         Routes,    // wrapper component used to group defined routes
         Route,     // component used to define a route via specifying url path and component to render when path matches
         Navigate   // used to handle redirection between routes
        } from 'react-router-dom'; // router library for creating and managing routes

import BasePageLayout      from '../AppPageLayouts/BasePageLayout/BasePageLayout.jsx'; // Base Page Layout with common features for ALL pages
import PublicPageLayout    from '../AppPageLayouts/PublicPageLayout.jsx';              // page layout for public pages
import ProtectedPageLayout from '../AppPageLayouts/ProtectedPageLayout.jsx';           // page layout for protected pages
import CheckoutPageLayout  from '../AppPageLayouts/CheckoutPageLayout/CheckoutPageLayout.jsx'; // specific layout for checkout process/page(s)

// All public pages
import ProductsPage        from '../PublicPages/ProductsPage/ProductsPage.jsx';     // 'home' page with all products
import ProductDetailsPage  from '../PublicPages/ProductDetailsPage/ProductDetailsPage.jsx'; // give product details for specific product by id
import CartPage            from '../PublicPages/CartPage/CartPage.jsx';             // dedicated cart page (fallback for slider cart, which is main)
import LoginPage           from '../PublicPages/LoginPage/LoginPage.jsx';           // login page for users to access protected pages
import RegisterPage        from '../PublicPages/RegisterPage/RegisterPage.jsx';     // registration page for new users

// All protected pages
import ProfilePage      from '../ProtectedPages/ProfilePage/ProfilePage.jsx';  // user profile page (only accessible after login)
import CheckoutPage     from '../ProtectedPages/CheckoutPage/CheckoutPage.jsx'; // checkout page for the checkout process (uses a separate page layout)
import OrderHistoryPage from '../ProtectedPages/OrderHistoryPage/OrderHistoryPage.jsx'; // page lists user's order history 
import OrderDetailsPage from '../ProtectedPages/OrderDetailsPage/OrderDetailsPage.jsx'; // page shows details for a specific order


const App = () => {

    return (
      <Router>
        <Routes>

          {/* Basepage layout that wraps ALL pages (both public and protected). '/' is start (and index) of all routes */}
          <Route path='/'   element={<BasePageLayout/>} >

            {/* All routes that are part of Public Page Layout */}
            <Route element={<PublicPageLayout/>}>

              {/* Redirect '/' and '/products' to '/products/all' */}
              <Route index            element={<Navigate to='/products/all'/>} />
              <Route path='/products' element={<Navigate to='/products/all'/>} />

              {/* Route for page with all */}
              <Route path='/products/all'    element={< ProductsPage />}  />

              {/* Route returns all products for specified category */}
              <Route path='/products/:category' element={<ProductsPage />} />

              {/* Routes that show product details for a given product via id */}
              <Route path='/products/:category/:id' element={<ProductDetailsPage />} />
              {/*<Route path='/products/all/:id' element={<ProductDetails />} /> */}

              {/* Dedicated cart page (fallback route for the main 'Cart Slider' overlay) */}
              <Route path='/cart' element={<CartPage />} />

              {/* Dedicated User Login page */}
              <Route path='/auth/login' element={<Navigate to='/login'/>} />
              <Route path='/login' element={<LoginPage/>} />

              {/* Dedicated User account Registration page */}
              <Route path='/auth/register' element={<Navigate to='/register'/>} />
              <Route path='/register' element={<RegisterPage/>} />
            </Route>

            {/* Protected Routes Layout */}
            <Route element={<ProtectedPageLayout />}>

              {/* Page shows user's profile information AND allows user to edit his/her profile information */}
              <Route path='/profile' element={<ProfilePage />} />

              {/* Page displays user's order history in table format (each row is a record for a past order) */}
              <Route path='/orders' element={<OrderHistoryPage />} />

              {/* Page shows details for a specific order via link in order history page */}
              <Route path='/orders/:orderId' element={<OrderDetailsPage />} />

            </Route>

          </Route>

          {/* Layout  for Checkout Process/Page(s) (also considered a PROTECTED page */}
          <Route element={<CheckoutPageLayout />}>
            <Route path='/checkout' element={<CheckoutPage />} />
          </Route>

        </Routes>
      </Router>
    );
}

export default App;