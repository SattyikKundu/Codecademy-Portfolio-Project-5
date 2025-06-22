import pool from "../database/database.js";

export const getOrdersByUserId = async (userId) => { // Return all orders for a specific user

  const query = `SELECT  
    orders.id AS order_id,                              -- order Id
    orders.placed_at,                                   -- time/date of order placed
    orders.total,                                       -- total paid for order
    orders.sub_total,                                   -- subtotal cost
    orders.tax_amount,                                  -- tax cost for order 
    orders.shipping_cost,                               -- shipping cost for order
    COUNT(orderItems.id) AS item_count,                 -- number of different items bought
    COALESCE(SUM(orderItems.quantity), 0) AS quantity   -- total quantity of products bought
    FROM orders
    LEFT JOIN order_items orderItems ON orders.id = orderItems.order_id
    WHERE orders.user_id = $1
    GROUP BY orders.id
    ORDER BY orders.placed_at DESC`;

  const result = await pool.query(query, [userId]);
  return result.rows; // return all rows
};
