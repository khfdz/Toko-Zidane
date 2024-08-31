
const express = require('express');
const router = express.Router();
const {
  createOrder
} = require('../controllers/orderController'); // Pastikan Anda sudah memiliki controller untuk order
const authenticate = require('../middlewares/authenticate');

// Endpoint untuk membuat order
router.post('/create', authenticate, createOrder);

module.exports = router;
