const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get deliveries for a specific driver
router.get('/:driverId/deliveries', (req, res) => {
  const driverId = req.params.driverId;
  const query = `SELECT * FROM Delivery WHERE driver_id = ?`;
  db.query(query, [driverId], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

// Update delivery status
router.put('/update-status', (req, res) => {
  const { delivery_id, delivery_status } = req.body;
  const delivered_at = delivery_status === 'delivered' ? new Date() : null;

  const query = `UPDATE Delivery SET delivery_status = ?, delivered_at = ? WHERE delivery_id = ?`;
  db.query(query, [delivery_status, delivered_at, delivery_id], (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    res.json({ message: 'Delivery status updated' });
  });
});

module.exports = router; // Ensure this line is present
