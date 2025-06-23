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

export const getOrderDetailsById = async (userId, orderId) => { // Fetch full order details (metadata + products) 
                                                                // for a SPECIFIC user AND order
  const query = `
    SELECT 
      orders.id AS order_id,     -- order details from 'orders' table
      orders.placed_at,
      orders.first_name,
      orders.last_name,
      orders.email,
      orders.phone_number,
      orders.address_line1,
      orders.address_line2,
      orders.city,
      orders.state,
      orders.postal_code,
      orders.sub_total,
      orders.tax_amount,
      orders.shipping_cost,
      orders.total,

      order_items.quantity,     -- items' quanity and unit price
      order_items.price_each,

      products.display_name,    -- product items' display name and image URL
      products.image_url

    FROM orders
    JOIN order_items ON orders.id = order_items.order_id
    JOIN products ON order_items.product_id = products.id
    WHERE orders.id = $1 AND orders.user_id = $2
  `;

  const result = await pool.query(query, [orderId, userId]);
  const rows = result.rows; // extract 'rows' from result

  if (rows.length === 0) return null; // return function if no order details (or row) returned

  const order = {   // Build structured result object for return as JSON to frontend
    order_id:       rows[0].order_id,
    placed_at:      rows[0].placed_at,
    first_name:     rows[0].first_name,
    last_name:      rows[0].last_name,
    email:          rows[0].email,
    phone_number:   rows[0].phone_number,
    address_line1:  rows[0].address_line1,
    address_line2:  rows[0].address_line2,
    city:           rows[0].city,
    state:          rows[0].state,
    postal_code:    rows[0].postal_code,
    sub_total:      rows[0].sub_total,
    tax_amount:     rows[0].tax_amount,
    shipping_cost:  rows[0].shipping_cost,
    total:          rows[0].total,
    items:          [], // stores items in order
  };


  rows.forEach(row => {   // Loop over all order's items and PUSH into items [] array
    order.items.push({
      product_name: row.display_name,
      image_url:    row.image_url,
      quantity:     row.quantity,
      unit_price:   row.price_each,
      total:        parseFloat(row.quantity) * parseFloat(row.price_each),
    });
  });

  return order;
}
