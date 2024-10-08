const express = require('express');
const router = express.Router();
const {
  addItemsToCart,
  getCartByUser,
  getAllCarts,
  getCartById,
  deleteCartById,
  editCartById,
  clearCart,
  deleteItemFromCart,
  editCartItemById
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
router.patch('/:id', authenticate, editCartById);

// Endpoint untuk mengosongkan cart
router.post('/clear', authenticate, clearCart);

// Endpoint untuk menghapus item dari cart
router.delete('/item/:cartId/:itemId', authenticate, deleteItemFromCart);

// Endpoint untuk mengedit item dalam cart berdasarkan ID cart dan ID item
router.patch('/item/:cartId/:itemId', authenticate, editCartItemById);



module.exports = router;
