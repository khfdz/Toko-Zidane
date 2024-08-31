// const Order = require('../models/orderModel');
// const Cart = require('../models/cartModel');

// // Controller untuk membuat order
// const createOrder = async (req, res) => {
//   const userId = req.user.id;
//   const { paymentAmount } = req.body;

//   try {
//     // Cari cart aktif berdasarkan user ID
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({ message: 'Active cart not found' });
//     }

//     // Cek apakah cart kosong
//     if (
//       !cart.items.length || 
//       cart.totalProduct === 0 || 
//       cart.totalQuantity === 0 || 
//       cart.subTotal === 0 || 
//       cart.totalPrice === 0
//     ) {
//       return res.status(400).json({ message: 'Cart is empty, unable to create order' });
//     }

//     // Hitung perubahan dan hutang
//     const totalPrice = cart.totalPrice;
//     const change = paymentAmount - totalPrice > 0 ? paymentAmount - totalPrice : 0;
//     const debt = paymentAmount < totalPrice ? totalPrice - paymentAmount : 0;

//     // Buat order baru
//     const order = new Order({
//       user: userId,
//       items: cart.items,
//       totalProduct: cart.totalProduct,
//       totalQuantity: cart.totalQuantity,
//       subTotal: cart.subTotal,
//       totalPrice: totalPrice,
//       paymentAmount: paymentAmount,
//       change: change,
//       debt: debt,
//       note: cart.note,
//       additionalText: cart.additionalText,
//       discount: cart.discount,
//       status: 'Sent'  // Status awal
//     });

//     // Simpan order ke database
//     await order.save();

//     // Kosongkan cart aktif
//     await Cart.findOneAndUpdate(
//       { user: userId },
//       {
//         items: [],
//         totalProduct: 0,
//         totalQuantity: 0,
//         note: '',
//         discount: 0,
//         additionalText: '',
//         additionalPrice: 0,
//         subTotal: 0,
//         totalPrice: 0
//       }
//     );

//     res.status(201).json({ message: 'Order created successfully', order });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// module.exports = { createOrder };

const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const User = require('../models/userModel'); // Pastikan model User di-import

// Controller untuk membuat order
const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { paymentAmount, customerName } = req.body; // Ambil nama pelanggan dari request body

  try {
    // Cari cart aktif berdasarkan user ID
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Active cart not found' });
    }

    // Cek apakah cart kosong
    if (
      !cart.items.length || 
      cart.totalProduct === 0 || 
      cart.totalQuantity === 0 || 
      cart.subTotal === 0 || 
      cart.totalPrice === 0
    ) {
      return res.status(400).json({ message: 'Cart is empty, unable to create order' });
    }

    // Hitung perubahan dan hutang
    const totalPrice = cart.totalPrice;
    const change = paymentAmount - totalPrice > 0 ? paymentAmount - totalPrice : 0;
    const debt = paymentAmount < totalPrice ? totalPrice - paymentAmount : 0;

    // Buat order baru
    const order = new Order({
      user: userId,
      items: cart.items,
      totalProduct: cart.totalProduct,
      totalQuantity: cart.totalQuantity,
      subTotal: cart.subTotal,
      totalPrice: totalPrice,
      paymentAmount: paymentAmount,
      change: change,
      debt: debt,
      note: cart.note,
      additionalText: cart.additionalText,
      discount: cart.discount,
      status: 'Sent',  // Status awal
      customerName: customerName || 'Pelanggan Setia' // Gunakan nama pelanggan dari request body atau default
    });

    // Simpan order ke database
    await order.save();

    // Update data pengguna untuk mencatat hutang jika ada
    if (debt > 0) {
      await User.findByIdAndUpdate(
        userId,
        { 
          $push: { debts: { 
            order: order._id, 
            date: new Date(), 
            amountPaid: paymentAmount, 
            amountDue: debt 
          } }
        },
        { new: true }
      );
    }

    // Kosongkan cart aktif
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
        customerName: 'Pelanggan Setia' // Reset customerName juga
      }
    );

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createOrder };
