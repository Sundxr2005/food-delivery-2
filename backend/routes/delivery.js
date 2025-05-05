// routes/delivery.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET delivery status for a user
router.get('/delivery-status/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT d.order_id, d.delivery_status, d.estimated_time
    FROM Delivery d
    JOIN Orders o ON d.order_id = o.order_id
    WHERE o.user_id = ?;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching delivery status:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});
module.exports = router;
