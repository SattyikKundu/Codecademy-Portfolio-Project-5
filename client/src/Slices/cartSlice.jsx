import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name:"cart",
    initialState: {
        products: []
        /* 
         * Each 'product' in cart store is formatted with following fields:
         *  [{ productId, imageFilePath, name, quantity, unitPrice, totalPrice, quantityLimit },....]
         * 
         * As an example:
         *  { 
         *    productId:'1', 
         *    imageFilePath:'http://localhost:5000/images/diamond_goby.png' , 
         *    name:'Diamond Goby', 
         *    quantity:'5', 
         *    unitPrice:'40.00', 
         *    totalPrice:'200.00', 
         *    quantityLimit:'10' 
         *  }
         */
    },
    reducers: {
        getAllCartItems(state) { // returns all products for display in cart
                return state.products;
        },
        addToCart(state, action) { // add product to cart

            const newProduct = action.payload; // save added product

            const existingProduct = state.products.find( // searches 'products' to see if product already in cart
                (product) => product.productId === newProduct.productId
            );

            if(existingProduct) { // If product already in cart AND below quantity limit...
                if(existingProduct.quantity <existingProduct.quantityLimit) {
                    existingProduct.quantity += 1; // increment by one!

                    // After incrementing, update priceTotal
                    existingProduct.totalPrice = (existingProduct.quantity * parseFloat(existingProduct.unitPrice)).toFixed(2);
                }
            }
            else { // if product NOT in cart yet...
                state.products.push({
                    ...newProduct, // add new product
                    quantity: 1,   // sets product.quantity to 1 
                                   // (overwrites existing 'quantity' value in 'newProduct') 
                    totalPrice: parseFloat(newProduct.unitPrice).toFixed(2) // sets product.priceTotal equal to priceEach 
                                                                // (overwrites existing 'priceTotal' value in 'newProduct')  
                })
            }
        },
        deleteFromCart(state, action) { // delete product from cart after clicking 'x' button 
            const id = action.payload.productId || action.payload; // get product's id (with a fallback)

            state.products = state.products.filter( // filter and return all product without matching id 
                        // (this leaves out the product with matching id, hence 'deleting' the product).
                (product) => product.productId !== id   
            );
        },
        increaseByOne(state, action) { // When clicking '+' button in cartItem card, increase quantity by one
            const id = action.payload.productId;
            const product = state.products.find( // 1st find and return product with matching id 
                (product) => product.productId === id
            );

            if (product && product.quantity < product.quantityLimit) { // then check if quantity is under the limit
                product.quantity += 1; // finally update quantity and update priceTotal
                product.totalPrice = (product.quantity * parseFloat(product.unitPrice)).toFixed(2);
            }
        },
        decreaseByOne(state, action) {
            const id = action.payload.productId;
            const product = state.products.find(
                product => product.productId === id // find and return produce with matching id
            ); 

            if (product && product.quantity > 1) { // Only decrease if existing quanitity >1
                product.quantity -= 1; // decrease and update priceTotal
                product.totalPrice = (product.quantity * parseFloat(product.unitPrice)).toFixed(2);
            }
        },
        loadCartFromServer(state, action) { // Used to load cart stored in backend and save it to this redux state
            state.products = action.payload;
        },
        clearCart(state) { // Clear cart state (used when user logs out). Since cart is empty by logout, 
                           // 'cartState' should be empty in localStroage after logout.
            state.products = []
        }
    }
});

export const selectProductQuantityById = (state, id) => { // return quantity of specific item (by id)

    const matchedProduct = state.cart.products.find( // find product with matching product id
                            product => product.productId === id
                           ); 
                           
    return (matchedProduct // return product quanitity (if product undefined/null, return 0 by default)
            ? matchedProduct.quantity 
            : 0
        ); 
}

export const {
              getAllCartItems,
              addToCart, 
              deleteFromCart, 
              increaseByOne, 
              decreaseByOne,
              loadCartFromServer,
              clearCart
            } = cartSlice.actions;

export default cartSlice.reducer;