import toast from 'react-hot-toast';

export const showCartToast = () => {
    toast.success('Added to Cart', {
        style: { // general style of toast message
            borderRadius: '10px',        // rounded message corners
            background: '#fff',         // white background
            border: '1px solid black',  // black border
            color: '#000',              // black text
            fontFamily: 'Arial',        // font-family of notification text
            fontWeight: 'Bold'          // font text bolded
        },
        duration: 1000,        // toast lasts 1 second
        position: 'top-right'  // place in general top-right area
    });
}