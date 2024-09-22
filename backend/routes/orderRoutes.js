
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getTotalDebtByCustomerId,
  deleteOrder,
  editOrder,
  payDebt,
  getLatestOrderByCustomerId
} = require('../controllers/orderController'); // Pastikan Anda sudah memiliki controller untuk order
const authenticate = require('../middlewares/authenticate');

// Endpoint untuk membuat order
router.post('/create', authenticate, createOrder);

// Endpoint untuk mendapatkan semua order
router.get('/all', authenticate, getAllOrders);

// Endpoint untuk mendapatkan total debt berdasarkan customer ID
router.get('/debt/:customerId', authenticate, getTotalDebtByCustomerId);

// Endpoint untuk menghapus order
router.delete('/:orderId', authenticate, deleteOrder);

// Endpoint untuk mengedit order
router.put('/:orderId', authenticate, editOrder);

// Endpoint untuk membayar utang
router.put('/pay-debt/:customerId', authenticate, payDebt);

// Endpoint untuk mendapatkan order terbaru berdasarkan customer ID
router.get('/latest/:customerId', authenticate, getLatestOrderByCustomerId);



module.exports = router;
