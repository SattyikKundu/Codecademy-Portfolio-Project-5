import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name:"cart",
    initialState: {
        products: []
        /* 
         * Each 'product' in cart store is formatted with following fields:
         *  [{ productId, imageFilePath, name, quantity, priceEach, priceTotal, quantityLimit },....]
         * 
         * As an example:
         *  { 
         *    productId:'1', 
         *    imageFilePath:'http://localhost:5000/images/diamond_goby.png' , 
         *    name:'Diamond Goby', 
         *    quantity:'5', 
         *    priceEach:'40.00', 
         *    priceTotal:'200.00', 
         *    maxQuantity:'10' 
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
                    existingProduct.priceTotal = (existingProduct.quantity * parseFloat(existingProduct.priceEach)).toFixed(2);
                }
            }
            else { // if product NOT in cart yet...
                state.products.push({
                    ...newProduct, // add new product
                    quantity: 1,   // sets product.quantity to 1 
                                   // (overwrites existing 'quantity' value in 'newProduct') 
                    priceTotal: parseFloat(newProduct.priceEach).toFixed(2) // sets product.priceTotal equal to priceEach 
                                                                // (overwrites existing 'priceTotal' value in 'newProduct')  
                })
            }
        },
        deleteFromCart(state, action) { // delete product from cart after clicking 'x' button
            const id = action.payload.productId;    // get product's id

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
                product.priceTotal = (product.quantity * parseFloat(product.priceEach)).toFixed(2);
            }
        },
        decreaseByOne(state, action) {
            const id = action.payload.productId;
            const product = state.products.find(
                product => product.productId === id // find and return produce with matching id
            ); 

            if (product && product.quantity > 1) { // Only decrease if existing quanitity >1
                product.quantity -= 1; // decrease and update priceTotal
                product.priceTotal = (product.quantity * parseFloat(product.priceEach)).toFixed(2);
            }
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
              decreaseByOne
            } = cartSlice.actions;

export default cartSlice.reducer;