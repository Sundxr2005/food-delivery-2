const express = require('express');
const router = express.Router();
const db = require('../config/db'); // your DB config file

router.post('/payments', (req, res) => {
    const { order_id, amount, payment_method, payment_status, paid_at } = req.body;
    
    // Make sure the payment status defaults to 'pending' if not provided
    const status = payment_status || 'pending';

    const sql = 'INSERT INTO payments (order_id, amount, payment_method, payment_status, paid_at) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [order_id, amount, payment_method, status, paid_at], (err, result) => {
        if (err) {
            console.error('Error inserting payment:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Payment recorded successfully', payment_id: result.insertId });
    });
});

module.exports = router;
