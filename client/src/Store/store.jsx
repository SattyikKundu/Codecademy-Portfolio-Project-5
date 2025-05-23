import { configureStore } from '@reduxjs/toolkit'; // method for configuring redux store
import cartReducer from '../Slices/cartSlice.jsx'; // import reducer for cart

/* A MAJOR feature of many E-commerce app sites is that
 * cart states are frequently stored in localStorage when user leaves the site. 
 * At a later time, when the user returns, the stored cart state from last
 * session becomes visible in the cart of the new session. The below functions
 * together with 'store' achives this data-persistence and IMPROVES user experience.
 */

const loadFromLocalStorage = () => { // loads cart state from local storage (if it exists)
    try {
        const cartState = localStorage.getItem('cartState'); // get cart state
        if (cartState === null) { // if cartState null (no cartState stored...) 
            return undefined;
        } 
        else { // otherwise return stores cart state
            return JSON.parse(cartState);
        }
    }
    catch(error) {
        console.warn("Failed to load 'cartState' from localStorage: ",error);
        return undefined;
    }
}

const saveToLocalStorage = (state) => { // save cart state to localStorage
    try {
        const cartState = JSON.stringify(state); // stringify state prior to storage
        localStorage.setItem('cartState', cartState);
    }
    catch(error) {
        console.warn('Failed to save in localStorage', error);
    }
}

const store = configureStore({ // CREATED store
    reducer: {
        cart: cartReducer,
    },
    preloadedState: { 
        cart: loadFromLocalStorage(), // at store mounting, preload cartState
    }
});

store.subscribe(() => {
  saveToLocalStorage(store.getState().cart); // Subscribe cart changes to local storage
});

export default store;