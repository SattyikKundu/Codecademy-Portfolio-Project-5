import { useLocation } from 'react-router-dom';

import './OrderDetailsPage.css';

const OrderDetailsPage = () => {

    const location = useLocation();
    const showSuccessMessage = location.state?.fromCheckoutSuccess;

    return (
        <div className='order-details-page'>
            {showSuccessMessage && (
                <div className='show-success-banner'>
                    Thank you for your purchase! Your order was placed successfully.
                </div>
            )}
            <p>Rest of the order's details goes here!!!</p>
        </div>
    );
}

export default OrderDetailsPage;