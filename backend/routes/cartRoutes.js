const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel'); // Import the Cart model
const authenticate = require('../middlewares/authenticate'); // Import authentication middleware

// Create a new cart
router.post('/', authenticate, async (req, res) => {
  try {
    const { user, items, status } = req.body;
    
    // Check if user exists
    if (!user || !items || items.length === 0) {
      return res.status(400).json({ message: 'User and items are required' });
    }
    
    // Create a new cart
    const cart = new Cart({
      user,
      items,
      status
    });
    
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all carts
router.get('/', authenticate, async (req, res) => {
  try {
    const carts = await Cart.find().populate('user').populate('items.product');
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get a single cart by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate('user').populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a cart by ID
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { user, items, status } = req.body;
    
    const cart = await Cart.findByIdAndUpdate(req.params.id, { user, items, status }, { new: true }).populate('user').populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a cart by ID
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    res.json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
