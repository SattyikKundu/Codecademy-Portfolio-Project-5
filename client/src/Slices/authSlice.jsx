import { createSlice } from "@reduxjs/toolkit";

/* Below slice used to track is user is logged in.
 * It's not a substitute for JWT and httpOnly cookies for 
 * keeping track of login sessions. But it's useful for 
 * toggling features that required logged in user info.
 */

const authSlice = createSlice({ 
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false
    },
    reducers: {
        setUser(state, action) { // assumed only VALID user data is provided (after logging in)
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearUser(state, action) { // clears user data from store
            state.user = null;
            state.isAuthenticated = false;
        },
        setUserFromToken(state, action) { // Store user IF getting user from token (optional atm)...
            if (action.payload) {
                state.user = action.payload;
                state.isAuthenticated = true;
            } 
            else {
                state.user = null;
                state.isAuthenticated = false;
            }
        }
    }
});

export const { setUser, 
               clearUser, 
               setUserFromToken
             } = authSlice.actions; // export slice actions

export default authSlice.reducer;// export reducer 