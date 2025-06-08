
import {
    getCartItem,
    addCartItem,
    updateCartItem,
    deleteCartItem,
    deleteCart,
    getProductStock,
    getCartItemsForUser
} from '../model/cartModel.js'; // import all functions from cartModel.js


export const syncCartWithReduxState = async (req, res) => { // Syncs 'products' array (from of 'cart' redux state) 
                                                            // with user's cart in database after login.
    try {
        const userId = req.user.id; // get user's id first (stored in JWT token)
        const incomingCartItems = req.body;    // extract incoming cart items from request body (should be in an array)

        if(!Array.isArray(incomingCartItems)) { // checks if incoming cart items is an array...
                                                // NOTE: array should be from {"products":[...]} object from localStorage

            return res.status(400).json({ error: 'Invalid cart data. Expected an array of items.' });   
        }

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

        res.status(200).json({ message: 'Cart items synced successfully!' }); // success message response after syncing all items
    }
    catch(error) { // if error occurs, log and respond with 500 error
        console.error('Error syncing cart items:', error);
        res.status(500).json({ error: 'Failed to sync cart items.' }); 
    }
}

export const overwriteCartWithReduxState = async (req, res) => { // overwrite backend cart with frontend cart (especially for logout)
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

/*******************************************************************************************************/
/*******************************************************************************************************/
/* Below controller functions are used to add product to cart, increase/decrease quantity 
 * of cart item, and drop item from cart. 
 * 
 * These are used in sync with the relevant 'Add to Cart' buttons (products pages), and the 
 * increase/decrease and 'X' (drop items) buttons found in the cartSlider and cart pages;
 * the routes with these controllers function are only valid when user if logged in and NOT in 'guest' mode.
 */
/*******************************************************************************************************/
/*******************************************************************************************************/

export const addItemToCart = async (req, res) => { // Add item to cart (or increase by 1 if already exists)

  try {
    const userId = req.user.id;     // logged in user's id
    const { productId } = req.body; // product id from request body

    const productStockResult = await getProductStock(productId);            // get stock of current item (ex: {stock: 30})
    const productStock = productStockResult ? productStockResult.stock : 0; // get its integer value
    if (!productStock || productStock <= 0) { // handle error
      return res.status(400).json({ error: "Product is out of stock." });
    }

    const existingCartItem = await getCartItem(userId, productId); // get item from cart (if it exists)

    let finalQuantity = 1; // placeholder for quantity
    if (existingCartItem) { // if item already exists in cart...
      finalQuantity = Math.min(existingCartItem.quantity + 1, productStock.stock, 10); // prevent going over quantity limit
      await updateCartItem(userId, productId, finalQuantity); // update item in cart
    } 
    else { // other add new item to cart with quantity one
      await addCartItem(userId, productId, 1);
    }

    res.status(200).json({ message: "Item added to cart successfully." }); // success message
  } 
  catch (error) { // error handling for failing to add to cart
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart." });
  }
};


export const increaseCartItem = async (req, res) => { // Increase quantity by 1

  try {
    const userId = req.user.id;       // user's id
    const { productId } = req.params; // product's id 


    const productStockResult = await getProductStock(productId);            // get stock of current item (ex: {stock: 30})
    const productStock = productStockResult ? productStockResult.stock : 0; // get its integer value
    if (!productStock || productStock <= 0) { // handle error
      return res.status(400).json({ error: "Product is out of stock." });
    }

    const existingCartItem = await getCartItem(userId, productId); // if cart item doesn't exist, return function
    if (!existingCartItem) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    const finalQuantity = Math.min(existingCartItem.quantity + 1, productStock.stock, 10);
    await updateCartItem(userId, productId, finalQuantity); // get final quantity, and then update cart

    res.status(200).json({ message: "Cart item quantity increased." }); // success message

  } 
  catch (error) { // error for failed cart item quantity increase
    console.error("Error increasing cart item:", error);
    res.status(500).json({ error: "Failed to increase cart item." });
  }
};


export const decreaseCartItem = async (req, res) => { // Decrease cart item's quantity by 1

  try {

    const userId = req.user.id;       // user id
    const { productId } = req.params; // product id

    const existingCartItem = await getCartItem(userId, productId); // check for existing item in cart
    if (!existingCartItem) { // if no item, return function
      return res.status(404).json({ error: "Cart item not found." });
    }

    if (existingCartItem.quantity > 1) { // If cart item exists, update
      await updateCartItem(userId, productId, existingCartItem.quantity - 1);
      res.status(200).json({ message: "Cart item quantity decreased." });
    } 
    else { // If quantity=0, it should be deleted
      await deleteCartItem(userId, productId);
      res.status(200).json({ message: "Cart item removed (quantity reached 0)." });
    }
  } 
  catch (error) { // Error if unable to decrease cart item quantity
    console.error("Error decreasing cart item:", error);
    res.status(500).json({ error: "Failed to decrease cart item." });
  }
};


export const removeCartItem = async (req, res) => { // remove item from cart when dropping item
  try {
    const userId = req.user.id; // user id and product id
    const { productId } = req.params;

    await deleteCartItem(userId, productId); // delete item

    res.status(200).json({ message: "Cart item removed." }); // success message
  } 
  catch (error) { // error if unable to delete cart
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Failed to remove cart item." });
  }
};
