const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import database connection
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const categoryRoutes = require('./routes/categoryRoutes'); // Import category routes
const productRoutes = require('./routes/productRoutes'); // Import product routes
const cartRoutes = require('./routes/cartRoutes');
const cartSaveRoutes = require('./routes/cartSaveRoutes'); // Import CartSave routes
const orderRoutes = require('./routes/orderRoutes');
const debtPaymentRoutes = require('./routes/debtPaymentRoutes');
const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes); // Register authentication routes
app.use('/categories', categoryRoutes); // Register category routes with authentication
app.use('/products', productRoutes); // Register product routes with authentication
app.use('/carts', cartRoutes); // Register cart routes
app.use('/cart-saves', cartSaveRoutes); // Register CartSave routes
app.use('/orders', orderRoutes); // Register order routes
app.use('/debt-payments', debtPaymentRoutes);

// Server
const PORT = process.env.PORT || 5151;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
