
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders
} = require('../controllers/orderController'); // Pastikan Anda sudah memiliki controller untuk order
const authenticate = require('../middlewares/authenticate');

// Endpoint untuk membuat order
router.post('/create', authenticate, createOrder);

// Endpoint untuk mendapatkan semua order
router.get('/all', authenticate, getAllOrders);

module.exports = router;
