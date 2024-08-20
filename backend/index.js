const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Database connection
const MONGO_URI = 'mongodb+srv://khfdz:khfdz123@latihaneduwork.xmpxf9v.mongodb.net/toko_zidane?retryWrites=true&w=majority&appName=LatihanEduwork';

mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
