const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'sundar',
  password: 'greatestofalltime077$',
  database: 'FoodDeliverySystem'
});
db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected...");
});
module.exports = db;
