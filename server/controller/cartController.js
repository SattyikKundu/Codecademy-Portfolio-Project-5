import { 
  getCartItem,
  insertCartItem,
  updateCartItemQuantity,
  getProductStock,
  getCartItemsForUser
} from '../model/cartModel.js'; // imports cart model functions to interact with the database


export const syncCartItems = async (req, res) => { // controller to sync localStorage cart items with database

  try {
    const userId = req.user.id; // extracts userId from verified JWT payload (via verifyJWT middleware)

    const incomingCartItems = req.body; // extract incoming cart items from request body (should be array)

    if (!Array.isArray(incomingCartItems)) { // checks that 'incomingCartItems' is array

      // If incoming data is not an array, respond with 400 error
      return res.status(400).json({ error: 'Invalid cart data. Expected an array of items.' });
    }

    for (const item of incomingCartItems) { // iterates over each item in incoming array
      
      const { productId, quantity } = item; // destructure productId and quantity from the item object

      if (!productId || !quantity || quantity <= 0) { // skip invalid items where 'productId' or 'quantity' is missing/invalid
        continue; // skip & end current for-loop iteration and go to next one
      }

      const productStock = await getProductStock(productId); // get current stock for selected product from 'products' table

      
      if (!productStock || productStock <= 0) { // If product doesn't exist or has no stock, skip syncing this item
        continue; // skip & end current for-loop iteration and go to next one
      }

      const finalQuantity = Math.min(quantity, productStock, 10); // calculates final allowed quantity based on stock and max. limit 10

      const existingCartItem = await getCartItem(userId, productId); // checks if  cart item already exists for user

      if (existingCartItem) { // If cart item exists, calculate new quantity by adding the incoming quantity
        const updatedQuantity = Math.min(
          existingCartItem.quantity + quantity, // add existing quantity and new incoming quantity
          productStock,                         // limit by available stock
          10                                    // or by the 10-item limit
        ); // returns smallest of 3 values

        await updateCartItemQuantity(userId, productId, updatedQuantity); // Updates existing cart item in database with new quantity

      } 
      else {
        await insertCartItem(userId, productId, finalQuantity); // If item doesn't exist, insert it as a new cart item into database
      }

    } // end of for loop...

   
    res.status(200).json({ message: 'Cart items synced successfully!' });  // respond via success message after syncing all items

  } 
  catch (error) { // if error occurs, log and respond with 500 error
    console.error('Error syncing cart items:', error);
    res.status(500).json({ error: 'Failed to sync cart items' });
  }
};


export const getCartItems = async (req, res) => { // controller to retrieve current cart items for user

  try {
    const userId = req.user.id; // extracts userId from verified JWT

    const cartItems = await getCartItemsForUser(userId); // fetchs current cart items for user from database

    const formattedCartItems = cartItems.map(item => ({ // transforms cart items to include totalPrice for each item

      ...item,                                                 // keep existing fields
      totalPrice: (item.unitPrice * item.quantity).toFixed(2), // calculate total price for display
    }));

    res.status(200).json(formattedCartItems); // responds with list of formatted cart items

  } 
  catch (error) { // if error occurs, log and respond with 500 error
    console.error('Error retrieving cart items:', error);
    res.status(500).json({ error: 'Failed to retrieve cart items' });
  }
};
