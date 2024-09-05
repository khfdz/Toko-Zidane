const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { paymentAmount = 0, status = 'processing' } = req.body;

  try {
    // Cari cart aktif berdasarkan user ID
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Active cart not found' });
    }

    // Hitung debt dan change
    const debt = paymentAmount < cart.totalPrice ? cart.totalPrice - paymentAmount : 0;
    const change = paymentAmount >= cart.totalPrice ? paymentAmount - cart.totalPrice : 0;

    // Buat ID order unik
    const orderId = `ORD-${uuidv4().split('-')[0].toUpperCase()}`;

    // Buat order baru
    const order = new Order({
      user: userId,
      customer: cart.customer,
      cart: cart._id,
      paymentAmount: paymentAmount,
      change: change,
      debt: debt,
      status: status,
      order_id: orderId,
      paymentDate: new Date()
    });

    await order.save();

    // Kosongkan cart setelah order berhasil dibuat
    await Cart.findOneAndUpdate(
      { user: userId },
      {
        items: [],
        totalProduct: 0,
        totalQuantity: 0,
        note: '',
        discount: 0,
        additionalText: '',
        additionalPrice: 0,
        subTotal: 0,
        totalPrice: 0,
        customer: { name: 'Pelanggan Setia', id: null }
      }
    );

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createOrder,
  getAllOrders
};
