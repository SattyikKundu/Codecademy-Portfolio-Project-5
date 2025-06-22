
import { getOrdersByUserId } from '../model/ordersModel.js';

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
