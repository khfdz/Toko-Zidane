const express = require('express');
const router = express.Router();
const {
  addItemsToCart,
  getCartByUser,
  getAllCarts,
  getCartById,
  deleteCartById,
  editCartById,
} = require('../controllers/cartController');
const authenticate = require('../middlewares/authenticate');

// Endpoint untuk menambahkan item ke cart
router.post('/add', authenticate, addItemsToCart);

// Endpoint untuk mendapatkan cart berdasarkan pengguna yang sedang login
router.get('/me', authenticate, getCartByUser);

// Endpoint untuk mendapatkan semua cart
router.get('/', authenticate, getAllCarts);

// Endpoint untuk mendapatkan cart berdasarkan ID
router.get('/:id', authenticate, getCartById);

// Endpoint untuk menghapus cart berdasarkan ID
router.delete('/:id', authenticate, deleteCartById);

// Endpoint untuk mengedit cart berdasarkan ID
router.put('/:id', authenticate, editCartById);

module.exports = router;
