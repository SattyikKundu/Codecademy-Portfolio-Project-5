
import { getOrdersByUserId,
         getOrderDetailsById 
       } from '../model/ordersModel.js';

export const fetchUserOrders = async (req, res) => { // fetch orders for specific user
  try {

    const userId = req.user.id; // extract user id
    const orders = await getOrdersByUserId(userId); // fetch orders

    res.status(200).json({ userId: userId, orders: orders }); // return orders
  } 
  catch (error) { // otherwise return error
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Unable to retrieve order history." });
  }
};


export const getOrderDetails = async (req, res) => { // fetches order details for  '/orders/:orderId'

  try {

    const userId = req.user.id; // extract parameters from request body (user.id from auth cookie)
    const orderId = req.params.orderId;

    const orderDetails = await getOrderDetailsById(userId, orderId); // get order details

    if (!orderDetails) {
      return res.status(404).json({ error: 'Order not found or access denied' });
    }

    res.status(200).json({orderDetails: orderDetails});
    
  } 
  catch (error) {
    console.error('Failed to fetch order details: ', error);
    res.status(500).json({ error: 'Server error fetching order details' });
  }
};
