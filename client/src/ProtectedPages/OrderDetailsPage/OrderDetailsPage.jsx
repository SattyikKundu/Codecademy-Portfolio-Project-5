import { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';     // Icon renderer
import { faScroll, faHouse } from '@fortawesome/free-solid-svg-icons';// Default sort icon (inactive column)

import Confetti from 'react-confetti';                  // use to 'pour' confetti on screen for celebratory purposes
import { useWindowSize } from '@react-hook/window-size'; // gets window dimensions to determine area of confetti use

import { formatTimestampToLongDate } from '../../utils/utilityFunctions';

import FooterBottom from '../../PageComponents/footerBottom/footerBottom';

import './OrderDetailsPage.css';

const OrderDetailsPage = () => {

  const location = useLocation(); // used to track current url location of react component
  const showSuccessMessage = location.state?.fromCheckoutSuccess; // checks if 'fromCheckoutSuccess' state is
                                                                  // transferred from a url redirect (presumably from checkout page)

  const { orderId } = useParams(); // Get orderId from URL

  const navigate = useNavigate(); // enables programmatic navigation

  /* Variable and state for Confetti pouring after successful checkout */
  const headerHeight = 60; /* Height of header menu */
  const [windowWidth, windowHeight] = useWindowSize(); /* Get window width and height */

  const [order,     setOrder] = useState(null); // Full order details object
  const [loading, setLoading] = useState(true); // Track loading state
  const [error,     setError] = useState(null); // Track error state

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`, 
          { withCredentials: true });
        setOrder(response.data.orderDetails);
      } 
      catch (error) {
        setError('Could not fetch order details.');
        console.log('Order Details Error: ',error);
      } 
      finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);


  if (loading) return <div className="order-details-loading">Loading order details...</div>;
  if (error)   return <div className="order-details-error">{error}</div>;
  if (!order)  return <div className="order-details-error">Order not found.</div>;

  return (
    <>
    <div className='order-details-page-wrapper' data-bg-var-repaint>
    <div className="order-details-page">
      {showSuccessMessage  &&  // If true, confetti is visible
      <Confetti 
        width={windowWidth}                   // Width of the confetti canvas (entire viewport width)
        height={windowHeight - headerHeight}  // Confetti only appears below the fixed header
        numberOfPieces={1000}                 // Total confetti pieces dropped before stopping (reasonable for perf)
        recycle={false}                       // Don't keep respawning confetti (single burst)
        gravity={0.2}                         // How fast confetti falls (0.3 = medium)
        run={true}                            // Enable animation; can be toggled off dynamically
        initialVelocityY={7}                 // How "hard" confetti shoots down (Y-axis velocity)
        style={{ 
          top: `${headerHeight}px`,           // Start confetti just **below** your header
          position: 'fixed',                  // Position relative to viewport, stays on screen
        }}
      />
      }
      {showSuccessMessage ? (
        <div className="order-thankyou-banner">
          <h2>✅ Thank you for your purchase!</h2>
          <div>Your order has been placed successfully.</div>
        </div>
      ) : (
        <div className="order-viewing-banner">
          <h2>📄 Order Summary</h2>
          <div>You are viewing the details of your past order.</div>
        </div>
      )}
      <div className="order-meta">
        <p><span id='order-id-span'>Order ID:</span> #{order.order_id}</p>
        <p><span id='order-date-span'>Order Date:</span> {formatTimestampToLongDate(order.placed_at)}</p>
      </div>

      <div className="shipping-info">
        <h3>Shipping Information:</h3>
        <div id='ship-info-name'>   <span>Name:</span> {order.first_name} {order.last_name}</div>
        <div id='ship-info-email'>  <span>Email:</span> {order.email}</div>
        <div id='ship-info-phone'>  <span>Phone:</span> {order.phone_number}</div>
        <div id='ship-info-address'>
          <span>Address:</span>
          <div>
            <p>{order.address_line1}</p>
            {order.address_line2 && <p>{order.address_line2}</p>}
            <p>{order.city}, {order.state} {order.postal_code}</p>
          </div>
        </div>
      </div>

      <div className="purchased-items">
        <h3>Purchased Items ({order.quantity_total}):</h3>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              {/* Import Quantity header component from BOTTOM of this code page */}
              <QuantityHeader />
              <th id='unit-header'>Unit Price</th>
              <th id='total-header'>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td id='table-img-path-data'>
                    <img 
                        //src={`http://localhost:5000/images/${item.image_url}`} 
                        src={`${import.meta.env.VITE_API_BASE_URL}/images/${item.image_url}`}
                        alt={item.product_name} 
                        className="product-thumb" 
                    />
                </td>
                <td id='table-item-name-data' >{item.product_name}</td>
                <td id='table-quantity-data'  >{item.quantity}</td>
                <td id='table-unit-price-data'>${parseFloat(item.unit_price).toFixed(2)}</td>
                <td id='table-item-total-data'>${parseFloat(item.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="order-summary-details">
        <h3>Order Summary:</h3>
        <div><strong>Subtotal:</strong> <span>${parseFloat(order.sub_total).toFixed(2)}</span></div>
        <div><strong>Tax:</strong>      <span>${parseFloat(order.tax_amount).toFixed(2)}</span></div>
        <div><strong>Shipping:</strong> <span>${parseFloat(order.shipping_cost).toFixed(2)}</span></div>
        <hr />
        <div><strong>Total:</strong> <span>${parseFloat(order.total).toFixed(2)}</span></div>
      </div>

      <div className="order-actions">
        <button 
          onClick={() => navigate('/')}
          ><FontAwesomeIcon icon={faHouse} /><span>Back to Home</span>
        </button>
        <button 
          onClick={() => navigate('/orders')}
          ><FontAwesomeIcon icon={faScroll} /><span>View Order History</span>
        </button>
      </div>
    </div>
    <FooterBottom />
    </div>
    </>
  );
}

export default OrderDetailsPage;

/*********************************************************************/
/********** Reack hook for changing Quantity header label ************/
/*********************************************************************/

export const QuantityHeader = () => {
  const [isWide, setIsWide] = useState(window.innerWidth > 480);

  useEffect(() => {
    function handleResize() {
      setIsWide(window.innerWidth > 480);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <th id="qty-header">{isWide ? 'Quantity' : 'Qty'}</th>
  );
}