require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const todoRoutes = require('./routes/tasks');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', todoRoutes);

// Start the server
app.listen(port, () => {
  console.log(`${process.env.APPNAME} is running on port ${port}`);
});
