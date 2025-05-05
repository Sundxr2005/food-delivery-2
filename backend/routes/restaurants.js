const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all restaurants
router.get('/', (req, res) => {
  db.query('SELECT * FROM Restaurants', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get menu items for a specific restaurant
router.get('/:id/menu', (req, res) => {
  const restaurantId = req.params.id;
  db.query('SELECT * FROM Menu_Items WHERE restaurant_id = ?', [restaurantId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
// routes/restaurants.js
router.get('/:id', (req, res) => {
    const restaurantId = req.params.id;

    const query = `
        SELECT r.*, m.item_id, m.name, m.price
        FROM Restaurants r
        LEFT JOIN Menu_Items m ON r.restaurant_id = m.restaurant_id
        WHERE r.restaurant_id = ?
    `;

    db.query(query, [restaurantId], (err, results) => {
        if (err) {
            console.error('Error fetching restaurant details:', err);
            return res.status(500).send('Server Error');
        }

        // Group menu items by restaurant
        const restaurant = {
            restaurant_id: results[0].restaurant_id,
            name: results[0].name,
            address: results[0].address,
            phone: results[0].phone,
            rating: results[0].rating,
            menu: results.map(item => ({
                item_id: item.item_id,
                name: item.name,
                price: item.price
            }))
        };

        res.json(restaurant);
    });
});
