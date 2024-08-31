const express = require('express');
const router = express.Router();
const {
  saveCart,
  loadCart,
  deleteSaveCart,
  getAllSaveCarts,
  getSaveCartById
} = require('../controllers/cartSaveController');
const authenticate = require('../middlewares/authenticate');

// Save cart
router.post('/save', authenticate, saveCart);

// Load cart
router.put('/load/:id', authenticate, loadCart);

// Delete Save Cart
router.delete('/delete/:id', authenticate, deleteSaveCart);

// Get All Save Carts
router.get('/', authenticate, getAllSaveCarts);

// Get Save Cart by ID
router.get('/:id', authenticate, getSaveCartById);

module.exports = router;
