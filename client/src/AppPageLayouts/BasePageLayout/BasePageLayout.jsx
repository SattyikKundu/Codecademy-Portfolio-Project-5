import { useState, useEffect } from "react"; // import React library
import { Toaster, toast, useToasterStore } from 'react-hot-toast'; // enable toast messaages to open in app page

import Menu from "../../PageComponents/menu/menu";
import CartSlider from "../../PageComponents/cartSlider/cartSlider";
import { Outlet } from "react-router-dom";


/* <BasePageLayout> serves as a "wrapper" that provides 
 * the necessary common functions & features like Toasts messages, 
 * header menu, and the cart slider to BOTH <PublicPageLayout> 
 * and the <ProtectedPageLayout>. For there, any specializations
 * for the respective page layout can then be added.
 */
//const BasePageLayout = ({ children }) => {

const BasePageLayout = () => {

    const [cartSliderOpen, setCartSliderOpen] = useState(false); // tracks when cart slider opens

    const toggleCart = () => { // toggles opening and closing of the cart slider
        setCartSliderOpen(prev => !prev); 
    }

    const { toasts } = useToasterStore(); // used to manage toast State
    const TOAST_LIMIT = 1;                // Limits to 1 toast per sandwich

    useEffect(() => { // useEffect() that dismisses last toast when added new toast exceeds TOAST_LIMIT.
                      // essentially prevent too many toasts on sandiwich due to rapid clicks.
        toasts
            .filter((selectedToast) => selectedToast.visible)           // Only consider visible toasts
            .filter((_, index) => index >= TOAST_LIMIT)                 // Is toast index over limit?
            .forEach((currentToast) => toast.dismiss(currentToast.id)); // Dismiss
    }, [toasts]);

    return (
        <div className="app-body">

            {/* Holds header menu component */}
            <Menu toggleCart={toggleCart} />

            {/* Cart Slider that user can access to track cart */}
            <CartSlider toggleCart={toggleCart} cartSliderOpen={cartSliderOpen} />

            {/*{children}*/}
            <Outlet />

            {/* Default <Toaster /> for toast messages */}
            <Toaster position={'top-right'} containerStyle={{ top: 70, right: 10}} 
            />
        </div>
    );
}

export default BasePageLayout;