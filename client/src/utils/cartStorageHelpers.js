/********************************************************************************************************/
/********************************************************************************************************/
/************* Helper function for storing cart items to database for logged in users *******************/
/************* and syncing the frontend cart in Redux/localStorage with the backend cart. ****************/
/********************************************************************************************************/
/********************************************************************************************************/

const syncLocalCartToServer = async () => { // Function POSTs localStorage cart to backend (if it exists)

  const localCartState = JSON.parse(localStorage.getItem('cartState')); // Retrieve cart from localStorage (if it exists)

  if (localCartState && localCartState.products.length > 0) { // Check if localCartState exists AND has products

    await axios.post( // Send POST request to backend route to sync localStorage cart with user's DB cart
      'http://localhost:5000/cart/sync',
      localCartState.products.map(product => ({ // Transform cart items for backend format (id and quantity)
        productId: product.productId,
        quantity: product.quantity
      })),
      { withCredentials: true } // Include JWT cookie since this is a protected route (req.user available)
    );

    localStorage.removeItem('cartState'); // Once synced, delete local cart to prevent duplicate re-sync on next login
  }
};


const fetchServerCart = async (dispatch) => { // Function GETs backend cart to display in frontend cart
  const response = await axios.get(
    'http://localhost:5000/cart', // Route to retrieve user's cart from backend
    { withCredentials: true } // Include JWT cookie for authentication
  );

  const fetchedCartItems = response.data;
  dispatch(loadCartFromServer(fetchedCartItems)); // Replace Redux cart with the latest backend cart
};
