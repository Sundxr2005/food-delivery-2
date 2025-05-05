const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM Orders', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

module.exports = router;
// routes/orders.js
router.post('/', (req, res) => {
  const { restaurant_id, user_id, total_price, items } = req.body;

  // Insert the order into the Orders table
  const orderQuery = `
      INSERT INTO Orders (user_id, restaurant_id, total_price, status)
      VALUES (?, ?, ?, 'pending')
  `;
  db.query(orderQuery, [user_id, restaurant_id, total_price], function(err, results) {
      if (err) {
          console.error('Error inserting order:', err);
          return res.status(500).json({ message: 'Failed to place order' });
      }

      const orderId = results.insertId;

      // Insert the order items into Order_Items table
      const orderItemsQuery = `
          INSERT INTO Order_Items (order_id, item_id, quantity, price, subtotal)
          VALUES ?
      `;
      const orderItems = items.map(item => [orderId, item.item_id, item.quantity, item.price, item.subtotal]);

      db.query(orderItemsQuery, [orderItems], function(err, results) {
          if (err) {
              console.error('Error inserting order items:', err);
              return res.status(500).json({ message: 'Failed to add order items' });
          }

          // Insert the payment record (set to pending by default)
          const paymentQuery = `
              INSERT INTO Payments (order_id, amount, payment_method, payment_status)
              VALUES (?, ?, 'cash on delivery', 'pending')
          `;
          db.query(paymentQuery, [orderId, total_price], function(err, results) {
              if (err) {
                  console.error('Error inserting payment:', err);
                  return res.status(500).json({ message: 'Failed to process payment' });
              }

              res.status(201).json({ message: 'Order placed successfully' });
          });
      });
  });
});
// routes/orders.js
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
  
    const query = `
      SELECT 
        o.order_id, 
        o.status, 
        o.total_price, 
        o.created_at, 
        r.name AS restaurant_name,
        oi.item_id, 
        oi.quantity, 
        oi.price, 
        m.name AS item_name
      FROM Orders o
      JOIN Order_Items oi ON o.order_id = oi.order_id
      JOIN Menu_Items m ON oi.item_id = m.item_id
      JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
      WHERE o.user_id = ?
    `;
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching orders:', err);
        return res.status(500).json({ message: 'Failed to fetch orders' });
      }
  
      const ordersMap = new Map();
  
      results.forEach(row => {
        if (!ordersMap.has(row.order_id)) {
          ordersMap.set(row.order_id, {
            order_id: row.order_id,
            status: row.status,
            total_price: row.total_price,
            restaurant_name: row.restaurant_name,
            created_at: row.created_at,
            items: []
          });
        }
  
        ordersMap.get(row.order_id).items.push({
          item_id: row.item_id,
          name: row.item_name,
          quantity: row.quantity,
          price: row.price
        });
      });
  
      const orders = Array.from(ordersMap.values());
      res.json(orders);
    });
  });
  

router.delete("/cancel/:order_id", (req, res) => {
  const orderId = req.params.order_id;

  // Begin a transaction to delete from both tables
  db.beginTransaction((err) => {
      if (err) {
          return res.status(500).json({ message: "Failed to start transaction" });
      }

      // Delete order items first
      const deleteOrderItemsQuery = "DELETE FROM Order_Items WHERE order_id = ?";
      db.query(deleteOrderItemsQuery, [orderId], (err) => {
          if (err) {
              return db.rollback(() => {
                  return res.status(500).json({ message: "Failed to delete order items" });
              });
          }

          // Now delete the order
          const deleteOrderQuery = "DELETE FROM Orders WHERE order_id = ?";
          db.query(deleteOrderQuery, [orderId], (err, result) => {
              if (err) {
                  return db.rollback(() => {
                      return res.status(500).json({ message: "Failed to delete order" });
                  });
              }

              // Commit the transaction if both queries are successful
              db.commit((err) => {
                  if (err) {
                      return db.rollback(() => {
                          return res.status(500).json({ message: "Failed to commit transaction" });
                      });
                  }

                  res.status(200).json({ message: "Order successfully cancelled and deleted" });
              });
          });
      });
  });
});

module.exports = router;