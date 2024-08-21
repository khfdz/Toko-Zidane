const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import database connection
const categoryRoutes = require('./routes/categoryRoutes'); // Import category routes
const productRoutes = require('./routes/productRoutes'); // Import product routes

dotenv.config(); // Load environment variables

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Serve static files from 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/categories', categoryRoutes); // Register category routes
app.use('/products', productRoutes); // Register product routes

// Server
const PORT = process.env.PORT || 5151;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
