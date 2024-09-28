const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

const addItemsToCart = async (req, res) => {
  const { items, additionalItems, note, discount, discountText, customer } = req.body;
  const userId = req.user.id;

  try {
    let customerData;

    // Validasi data pelanggan
    if (customer && customer.id) {
      customerData = await User.findById(customer.id);
      if (!customerData) {
        return res.status(404).json({ message: 'Customer not found' });
      }
    } else {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      customerData = {
        name: user.name || 'Unknown Customer',
        id: user._id
      };
    }

    let cart = await Cart.findOne({ user: userId }) || new Cart({ user: userId, customer: customerData, items: [] });

    cart.customer = customerData;

    let subTotal = 0;

    // Menambahkan item ke keranjang
    for (const item of items) {
      const { productId, quantity } = item.product; // Ambil productId dan quantity

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }

      const itemTotalPrice = product.wholesale_price * quantity;

      const existingItemIndex = cart.items.findIndex(cartItem => cartItem.product.name === product.name);
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].product.quantity += quantity;
        cart.items[existingItemIndex].product.totalPriceProduct += itemTotalPrice;
      } else {
        cart.items.push({
          product: {
            price: product.wholesale_price,
            name: product.name,
            quantity: quantity,
            totalPriceProduct: itemTotalPrice
          }
        });
      }
      subTotal += itemTotalPrice;
    }

    // Menambahkan item tambahan
    if (additionalItems && Array.isArray(additionalItems)) {
      for (const additionalItem of additionalItems) {
        const { price, name, quantity } = additionalItem.product; // Ambil price, name, dan quantity

        if (price == null || name == null || quantity == null) {
          return res.status(400).json({ message: 'All additional item fields are required' });
        }

        const additionalTotalPrice = price * quantity;
        subTotal += additionalTotalPrice; // Update subtotal

        cart.additionalItems.push({
          product: {
            price: price,
            name: name,
            quantity: quantity,
            totalPriceProduct: additionalTotalPrice
          }
        });
      }
    }

    // Update total cart
    cart.subTotal = subTotal;
    cart.totalPrice = subTotal - (discount || 0);
    cart.totalProduct = cart.items.length + (additionalItems ? additionalItems.length : 0);
    cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0);

    cart.note = note || cart.note;
    cart.discount = discount || cart.discount;
    cart.discountText = discountText || cart.discountText;

    // Simpan keranjang
    await cart.save();

    // Kirim respon sukses
    res.status(201).json({
      message: 'Items added to cart successfully',
      cart
    });
  } catch (error) {
    console.error('Error adding items to cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate({
      path: 'items.product',
      select: 'price name'
    });

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getCartById = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findById(id).populate({
      path: 'items.product',
      select: 'price name'
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getCartByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'price name quantity totalPriceProduct'
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteCartById = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findByIdAndDelete(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const editCartById = async (req, res) => {
  const { id } = req.params;
  const { items, note, discount, discountText, additionalItems, customerName } = req.body;

  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Update customerName if provided
    if (customerName) {
      const customer = await User.findOne({ name: customerName });
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      cart.customer.name = customer.name;
      cart.customer.id = customer._id;
    }

    // If items provided, update items and subtotal
    if (items) {
      cart.items = [];
      let subTotal = 0;

      for (const item of items) {
        const { productId, quantity } = item;

        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${productId} not found` });
        }

        const itemTotalPrice = product.wholesale_price * quantity;

        cart.items.push({
          product: {
            price: product.wholesale_price,
            name: product.name,
            quantity: quantity,
            totalPriceProduct: itemTotalPrice
          }
        });
        subTotal += itemTotalPrice;
      }

      // Update total quantities
      cart.subTotal = subTotal;
      cart.totalPrice = subTotal - (discount || 0);
      cart.totalProduct = cart.items.length;
      cart.totalQuantity = cart.items.reduce((acc, item) => acc + item.product.quantity, 0);
      
      cart.note = note || cart.note;
      cart.discount = discount || cart.discount;
      cart.discountText = discountText || cart.discountText;
      cart.additionalItems = additionalItems || cart.additionalItems;
    }

    // Save changes
    await cart.save();

    res.status(200).json({
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear cart items
    cart.items = [];
    cart.subTotal = 0;
    cart.totalPrice = 0;
    cart.totalProduct = 0;
    cart.totalQuantity = 0;

    await cart.save();

    res.status(200).json({
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  addItemsToCart,
  getAllCarts,
  getCartById,
  getCartByUser,
  deleteCartById,
  editCartById,
  clearCart
};
