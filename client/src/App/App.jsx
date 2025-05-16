import { BrowserRouter as Router,  // provides routing functionality via browser's history API
         Routes,  // wrapper component used to group defined routes
         Route    // component used to define a route via specifying url path and component to render when path matches
        } from 'react-router-dom'; // router library for creating and managing routes


import AppPageLayout from '../Pages/AppPageLayout/AppPageLayout.jsx'; // Import page layout for entire App (very important!)
import ProductsPage from '../Pages/ProductsPage/ProductsPage.jsx';    // imports <ProductsPage /> as home page route (shows all products)

const App = () => {

    return (
      <Router>
        <Routes>
          <Route path='/' element={<AppPageLayout/>} >
            <Route index element={< ProductsPage />} />
          </Route>
        </Routes>
      </Router>
    );
}

export default App;