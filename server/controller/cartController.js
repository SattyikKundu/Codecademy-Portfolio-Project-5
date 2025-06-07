
import {
    getCartItem,
    addCartItem,
    updateCartItem,
    deleteCartItem,
    deleteCart,
    getProductStock,
    getCartItemsForUser
} from '../model/cartModel.js'; // import all functions from cartModel.js

//import pool from '../database/database.js';

export const syncCartWithReduxState = async (req, res) => { // Syncs 'products' array (from of 'cart' redux state) 
                                                            // with user's cart in database after login.
    try {
        const userId = req.user.id; // get user's id first (stored in JWT token)
        const incomingCartItems = req.body;    // extract incoming cart items from request body (should be in an array)

        if(!Array.isArray(incomingCartItems)) { // checks if incoming cart items is an array...
                                                // NOTE: array should be from {"products":[...]} object from localStorage

            return res.status(400).json({ error: 'Invalid cart data. Expected an array of items.' });   
        }

        /*await pool.query('BEGIN'); /* Starts a database transaction to ensure that either all
                                    * operations are completed OR there's a rollback of all operations
                                    * if one or more operations fail for whatever reasons.
                                    * This PREVENTS any partial successes/failures from being commited to database.
                                    */

        for (const item of incomingCartItems) { // iterate through 'incomingCartItems' via for-loop

            const { productId, quantity } = item; // destructure to get product id and its quantity in cart

            const parsedQuantity = parseInt(quantity, 10); // turn any string quantity (ex: '2') into integer

            if (!productId || isNaN(parsedQuantity) || parsedQuantity <= 0) { // if invalid values provided..
                continue; // skip & end current for-loop iteration and go to next one
            } 

            const productStockResult = await getProductStock(productId); // get stock of current item (ex: {stock: 30})
            const productStock = productStockResult ? productStockResult.stock : 0; // get its integer value

            if (!productStock || productStock <=0) { // if 'productStock' is invalid
                continue; // skip & end current for-loop iteration and go to next one
            }

            const existingCartItem = await getCartItem(userId, productId); // check if product already exists in backend cart

            if(existingCartItem) { // if exiting item exists calculate new quantity by adding quantity from frontend cartState,
                                   // but do not exceed stock limit or cart limit 10.

                /* Take sum of frontend quantity and add to cart item's quantity in backend
                   but can't exceed stock amount or cart limit 10 */
                const finalQuantity = Math.min(productStock,(existingCartItem.quantity+parsedQuantity), 10); 

                await updateCartItem(userId, productId, finalQuantity); // final update for cart item for 
                                                                        // backend cart (no return needed)
            }
            else { // otherwise cart item doesn't already exist in database

                const finalQuantity = Math.min(productStock, parsedQuantity, 10); 
                await addCartItem(userId, productId, finalQuantity); // add cart item and its quantity to backend

            }
        } //end of loop

        //await pool.query('COMMIT'); // End of database transaction (see pool.query('COMMIT') from before loop)

        res.status(200).json({ message: 'Cart items synced successfully!' }); // success message response after syncing all items
    }
    catch(error) { // if error occurs, log and respond with 500 error
        console.error('Error syncing cart items:', error);
        //await pool.query('ROLLBACK'); // undo any partial inserts/updates from earlier transction 
                                      // will later test and review if these transactions are necessary.
        res.status(500).json({ error: 'Failed to sync cart items.' }); 
    }
}

export const overwriteCartWithReduxState = async (req, res) => {
  try {
    const userId = req.user.id;
    const incomingCartItems = req.body;

    if (!Array.isArray(incomingCartItems)) { // checks if 'incomingCartItems' is an array (products: [...])
      return res.status(400).json({ error: 'Invalid cart data. Expected an array of items.' });
    }

    await deleteCart(userId); // delete logged in user's backend cart in database PRIOR to overwriting it

     
    for (const item of incomingCartItems) { // Add each item from frontend’s final cart to backend cart

      const { productId, quantity } = item;            // destructure values from each item
      const parsedQuantity = parseInt(quantity, 10);   // turn string value into integer (with radix/base-value 10)
      if (!productId || isNaN(parsedQuantity) || parsedQuantity <= 0) { // skip for-loop iteration if invalid value(s)
        continue;
      }
        
      const productStockResult  = await getProductStock(productId);           // get stock of item
      const productStock = productStockResult ? productStockResult.stock : 0; // get its integer value (ex: {stock: 30})
      if (!productStock || productStock <= 0) { // skip for-loop iteration if invalid stock number
        continue;
      }

      const finalQuantity = Math.min(parsedQuantity, productStock, 10); // get final product quantity
      await addCartItem(userId, productId, finalQuantity);  // add item to cart

    } // end of for-loop

    res.status(200).json({ message: 'Cart overwritten successfully!' });
  } 
  catch (error) { // error handling
    console.error('Error overwriting cart:', error);
    res.status(500).json({ error: 'Failed to overwrite cart.' });
  }
};


export const getCartItemsFromBackend = async (req,res) => { // retrieves all cart items from current user's stored cart

    try {
        const userId = req.user.id; // get user's id first (stored in JWT token)
        //console.log('User id: ',userId);

        const userCart = await getCartItemsForUser(userId); // get cart items from backend for user

        if (userCart && userCart.length > 0) { // if userCart is valid and not empty...
            res.status(200).json({
                message: 'Cart items retrieved from backend successfully!',
                cartState: { products: userCart }
            });
        } 
        else { // if 'useCart' from backend if empty/falsy...
            res.status(200).json({
                message: 'No cart items found.',
                cartState: { products: [] } // send consistent 'cartState' even if empty
            });
        }
    }
    catch(error) { // if error occurs, log and respond with 500 error
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ error: 'Failed to retrieve cart items for user.' });
    }
}