import toast from 'react-hot-toast';

export const addedToCartToast = () => { // toast for successful adding of product to cart
    toast.success('Added to Cart', {
        style: { // general style of toast message
            borderRadius: '10px',       // rounded message corners
            background: '#fff',         // white background
            border: '1px solid black',  // black border
            color: '#000',              // black text
            fontFamily: 'Arial',        // font-family of notification text
            fontWeight: 'Bold',         // font text bolded
        },
        duration: 1000,        // toast lasts 1 second
        position: 'top-right'  // place in general top-right area
    });
}

export const LoginSuccessToast = () => { // toast for successful login
    toast.success('Successfully Login', {
        style: { // general style of toast message
            borderRadius: '10px',       // rounded message corners
            background: '#fff',         // white background
            border: '1px solid black',  // black border
            color: '#000',              // black text
            fontFamily: 'Arial',        // font-family of notification text
            fontWeight: 'Bold',         // font text bolded
        },
        duration: 2000,        // toast lasts 3 second
        position: 'top-center'  // place in general top-center area
    });
}

export const LoginFailedToast = ({error = 'Login failed.'}) => { // toast for failed login attempt
    toast.error(error, {
        style: { // general style of toast message
            borderRadius: '10px',       // rounded message corners
            background: '#fff',         // white background
            border: '1px solid black',  // black border
            color: '#000',              // black text
            fontFamily: 'Arial',        // font-family of notification text
            fontWeight: 'Bold',         // font text bolded
        },
        duration: 2000,        // toast lasts 3 second
        position: 'top-center'  // place in general top-center area
    });
}

