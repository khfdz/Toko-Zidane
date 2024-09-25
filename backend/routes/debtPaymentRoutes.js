const express = require('express');
const router = express.Router();
const {
  createDebtPayment,
  getAllDebtPayments,
  getByIdCustomerId,
  getLatestPaydebtAndOrderByCustomerId
} = require('../controllers/debtPaymentController');
const authenticate = require('../middlewares/authenticate');

// Endpoint untuk membuat pembayaran hutang
router.post('/create', authenticate, createDebtPayment);

// Endpoint untuk mendapatkan semua pembayaran hutang
router.get('/', authenticate, getAllDebtPayments);

// Endpoint untuk mendapatkan pembayaran hutang berdasarkan customerId
router.get('/customer/:customerId', authenticate, getByIdCustomerId);

// Endpoint untuk mendapatkan pembayaran hutang dan order terbaru berdasarkan customerId
router.get('/latest/:customerId', authenticate, getLatestPaydebtAndOrderByCustomerId);

module.exports = router;
