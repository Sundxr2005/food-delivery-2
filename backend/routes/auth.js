const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with env variable in production

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, phone, address, user_type } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO Users (name, email, phone, address, user_type, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, phone, address, user_type, hashedPassword], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Registration failed' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM Users WHERE email = ?`;
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ user_id: user.user_id, user_type: user.user_type }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  });
});

module.exports = router;
