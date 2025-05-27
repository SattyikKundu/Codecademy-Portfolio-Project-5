import { useState } from "react"; // import React library
import { Toaster, toast } from 'react-hot-toast'; // enable toast messaages to open in app page

import Menu from "../../PageComponents/menu/menu";
import CartSlider from "../../PageComponents/cartSlider/cartSlider";


/* <BasePageLayout> serves as a "wrapper" that provides 
 * the necessary common functions & features like Toasts messages, 
 * header menu, and the cart slider to BOTH <PublicPageLayout> 
 * and the <ProtectedPageLayout>. For there, any specializations
 * for the respective page layout can then be added.
 */
const BasePageLayout = ({ children }) => {

    const [cartSliderOpen, setCartSliderOpen] = useState(false); // tracks when cart slider opens
    const toggleCart = () => { setCartSliderOpen(prev => !prev); }

    const [toastOffset,   setToastOffset]   = useState({ top: 70, right: 10 }); // states to handle offsets of toast
    const [toastPosition, setToastPosition] = useState('top-right');
    toast.limit = 2; // allow most 2 'toasts' to stack at once

    return (
        <div className="app-body">

            {/* Holds header menu component */}
            <Menu toggleCart={toggleCart} />

            {/* Cart Slider that user can access to track cart */}
            <CartSlider toggleCart={toggleCart} cartSliderOpen={cartSliderOpen} />

            {children}

            {/* Create <Toaster /> for toast messages with  */}
            <Toaster position={toastPosition} containerStyle={toastOffset} />
        </div>
    );
}

export default BasePageLayout;