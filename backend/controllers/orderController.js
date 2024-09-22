const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

// Buat order baru
const createOrder = async (req, res) => {
  const adminId = req.user.id;
  const { paymentAmount = 0, status = 'processing' } = req.body;

  try {
    const cart = await Cart.findOne({ user: adminId }).populate('customer.id');
    if (!cart) {
      return res.status(404).json({ message: 'Active cart not found' });
    }

    const customerId = cart.customer.id;
    const customerName = cart.customer.name; // Ambil nama customer dari cart

    console.log('Customer ID:', customerId);
    console.log('Customer Name:', customerName);

    if (!customerId) {
      return res.status(404).json({ message: 'Customer ID not found in cart' });
    }

    if (!customerName) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    const debt = paymentAmount < cart.totalPrice ? cart.totalPrice - paymentAmount : 0;
    const change = paymentAmount >= cart.totalPrice ? paymentAmount - cart.totalPrice : 0;

    const orderId = `ORD-${uuidv4().split('-')[0].toUpperCase()}`;

    const order = new Order({
      user: adminId,
      customer: { id: customerId, name: customerName },
      cart: {
        items: cart.items,
        note: cart.note,
        discount: cart.discount,
        additionalText: cart.additionalText,
        additionalPrice: cart.additionalPrice,
        cr_id: cart.cr_id,
        totalProduct: cart.totalProduct,
        totalQuantity: cart.totalQuantity,
        subTotal: cart.subTotal,
        totalPrice: cart.totalPrice
      },
      paymentAmount: paymentAmount,
      change: change,
      debt: debt,
      status: status,
      order_id: orderId,
      paymentDate: new Date()
    });

    await order.save();

    await User.findByIdAndUpdate(customerId, {
      $push: { orderHistory: order._id }
    });

    await Cart.findOneAndUpdate(
      { user: adminId },
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



// Dapatkan semua order
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Dapatkan total utang berdasarkan ID pelanggan
const getTotalDebtByCustomerId = async (req, res) => {
  const customerId = req.params.customerId;

  try {
    // Temukan semua order berdasarkan customer.id
    const orders = await Order.find({ 'customer.id': customerId });

    // Hitung total debt dari semua order yang ditemukan
    const totalDebt = orders.reduce((acc, order) => acc + order.debt, 0);

    // Kembalikan hasil berupa total debt
    res.status(200).json({
      customerId: customerId,
      totalDebt: totalDebt,
      orders: orders
    });
  } catch (error) {
    console.error('Error fetching total debt by customer ID:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Hapus order berdasarkan ID
const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Hapus order dari riwayat order pelanggan
    await User.findByIdAndUpdate(order.customer.id, {
      $pull: { orderHistory: order._id }
    });

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Edit order berdasarkan ID
const editOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const { paymentAmount, status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update informasi order
    if (paymentAmount !== undefined) {
      order.paymentAmount = paymentAmount;
      // Hitung ulang debt dan change berdasarkan paymentAmount yang baru
      order.debt = paymentAmount < order.cart.totalPrice ? order.cart.totalPrice - paymentAmount : 0;
      order.change = paymentAmount >= order.cart.totalPrice ? paymentAmount - order.cart.totalPrice : 0;
    }

    if (status !== undefined) {
      order.status = status;
    }

    await order.save();
    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error editing order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Endpoint untuk membayar utang
const payDebt = async (req, res) => {
  const { customerId, paymentAmount } = req.body;

  try {
    const orders = await Order.find({ 'customer.id': customerId });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this customer' });
    }

    let remainingPayment = paymentAmount;

    orders.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));

    for (const order of orders) {
      if (remainingPayment <= 0) break;

      if (order.debt > remainingPayment) {
        order.debt -= remainingPayment;
        order.paymentAmount += remainingPayment;
        remainingPayment = 0;
      } else {
        remainingPayment -= order.debt;
        order.paymentAmount += order.debt;
        order.debt = 0;
      }

      if (order.debt === 0) {
        order.status = 'completed';
      }

      await order.save();
    }

    if (remainingPayment > 0) {
      return res.status(200).json({ message: 'Partial payment made', remainingPayment });
    }

    res.status(200).json({ message: 'Debt payment completed successfully' });
  } catch (error) {
    console.error('Error paying debt:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Dapatkan order terbaru berdasarkan ID customer
const getLatestOrderByCustomerId = async (req, res) => {
  const customerId = req.params.customerId;

  try {
    // Temukan order terbaru berdasarkan customer.id dan urutkan berdasarkan paymentDate secara menurun
    const latestOrder = await Order.findOne({ 'customer.id': customerId })
      .sort({ paymentDate: -1 });

    if (!latestOrder) {
      return res.status(404).json({ message: 'No orders found for this customer' });
    }

    // Kembalikan order terbaru
    res.status(200).json({ latestOrder });
  } catch (error) {
    console.error('Error fetching latest order by customer ID:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getTotalDebtByCustomerId,
  deleteOrder,
  editOrder,
  payDebt,
  getLatestOrderByCustomerId
};
