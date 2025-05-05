const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const restaurantRoutes = require('./routes/restaurants');
app.use('/api/restaurants', restaurantRoutes);

const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);
const deliveryRoutes = require('./routes/delivery');
app.use('/api', deliveryRoutes);
const driverRoutes = require('./routes/driver');
app.use('/api/driver', driverRoutes);
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use(express.static('frontend'));

const paymentRoutes = require('./routes/payments'); // Path to the file above
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
// Add more routes...
app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));

app.listen(5000, () => console.log('Server started on port 5000'));
