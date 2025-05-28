import { BrowserRouter as Router,  // provides routing functionality via browser's history API
         Routes,    // wrapper component used to group defined routes
         Route,     // component used to define a route via specifying url path and component to render when path matches
         Navigate   // used to handle redirection between routes
        } from 'react-router-dom'; // router library for creating and managing routes

import ProtectedPageLayout from '../AppPageLayouts/ProtectedPageLayout.jsx'; // page layout for protected pages
import PublicPageLayout   from '../AppPageLayouts/PublicPageLayout.jsx';    // page layout for entire App (very important!)
import ProductsPage       from '../PublicPages/ProductsPage/ProductsPage.jsx';            // imports <ProductsPage /> as home page route (shows all products)
import ProductDetailsPage from '../PublicPages/ProductDetailsPage/ProductDetailsPage.jsx';
import CartPage           from '../PublicPages/CartPage/CartPage.jsx';
import LoginPage from '../PublicPages/LoginPage/LoginPage.jsx';

const App = () => {

    return (
      <Router>
        <Routes>
          {/* Main layout route that wraps all pages. '/' is start (and index) of all routes */}
          <Route path='/'   element={<PublicPageLayout/>} >

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

          </Route>
        </Routes>
      </Router>
    );
}

export default App;