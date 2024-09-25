const DebtPayment = require('../models/debtPaymentModel');
const Order = require('../models/orderModel');

// Membuat pembayaran hutang
const createDebtPayment = async (req, res) => {
  const { customerId, amount } = req.body;

  try {
    // Cari semua order yang belum lunas berdasarkan customerId
    const orders = await Order.find({ 'customer.id': customerId, debt: { $gt: 0 } });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No outstanding debts for this customer' });
    }

    let remainingPayment = amount;
    const paidOrders = [];

    // Urutkan order berdasarkan tanggal pembayaran agar pembayaran didistribusikan dari order paling awal
    orders.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));

    // Distribusikan pembayaran ke order yang belum lunas
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

      // Jika utang pada order lunas, ubah status menjadi 'completed'
      if (order.debt === 0) {
        order.status = 'completed';
      }

      await order.save();
      paidOrders.push(order._id); // Simpan ID order yang terpengaruh
    }

    // Buat catatan pembayaran hutang baru di DebtPayment
    const newDebtPayment = new DebtPayment({
      customerId,
      amount,
      orders: paidOrders // Simpan daftar order yang telah dibayar
    });

    // Simpan DebtPayment ke database
    await newDebtPayment.save();

    if (remainingPayment > 0) {
      return res.status(200).json({
        message: 'Partial payment made, remaining balance not fully applied to debt',
        remainingPayment,
        debtPayment: newDebtPayment,
        payDebt_id: newDebtPayment.payDebt_id // Tambahkan payDebt_id ke response
      });
    }

    res.status(201).json({
      message: 'Debt payment created successfully and fully applied to debts',
      debtPayment: newDebtPayment,
      payDebt_id: newDebtPayment.payDebt_id // Tambahkan payDebt_id ke response
    });
  } catch (error) {
    console.error('Error creating debt payment:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mengambil semua pembayaran hutang
const getAllDebtPayments = async (req, res) => {
  try {
    const debtPayments = await DebtPayment.find().populate('orders', 'order_id paymentAmount debt status');
    res.status(200).json(debtPayments);
  } catch (error) {
    console.error('Error fetching all debt payments:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mengambil pembayaran hutang berdasarkan customerId
const getByIdCustomerId = async (req, res) => {
  const { customerId } = req.params;

  try {
    const debtPayments = await DebtPayment.find({ customerId }).populate('orders', 'order_id paymentAmount debt status');
    if (debtPayments.length === 0) {
      return res.status(404).json({ message: 'No debt payments found for this customer' });
    }
    res.status(200).json(debtPayments);
  } catch (error) {
    console.error('Error fetching debt payments by customerId:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Mengambil pembayaran hutang dan order terbaru berdasarkan customerId
// const getLatestPaydebtAndOrderByCustomerId = async (req, res) => {
//   const { customerId } = req.params;

//   try {
//     // Mengambil pembayaran hutang terbaru dan memuat detail orders
//     const latestDebtPayment = await DebtPayment.findOne({ customerId })
//       .sort({ paymentDate: -1 })
//       .populate('orders', 'order_id paymentAmount debt status');

//     // Mengambil order terbaru yang masih memiliki utang
//     const latestOrder = await Order.findOne({ 'customer.id': customerId, debt: { $gt: 0 } })
//       .sort({ paymentDate: -1 });

//     res.status(200).json({
//       latestDebtPayment,
//       latestOrder,
//       payDebt_id: latestDebtPayment?.payDebt_id // Tambahkan payDebt_id ke response
//     });
//   } catch (error) {
//     console.error('Error fetching latest debt payment and order:', error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

const getLatestPaydebtAndOrderByCustomerId = async (req, res) => {
  const { customerId } = req.params;

  try {
    // Mengambil pembayaran hutang terbaru dan memuat detail orders
    const latestDebtPayment = await DebtPayment.findOne({ customerId })
      .sort({ paymentDate: -1 })
      .populate('orders', 'order_id paymentAmount debt status');

    // Mengambil order terbaru berdasarkan customerId tanpa filter debt
    const latestOrder = await Order.findOne({ 'customer.id': customerId })
      .sort({ paymentDate: -1 });

    // Jika tidak ada pembayaran hutang dan order ditemukan
    if (!latestDebtPayment && !latestOrder) {
      return res.status(404).json({ message: 'No orders or debt payments found for this customer' });
    }

    res.status(200).json({
      latestDebtPayment,
      latestOrder,
      payDebt_id: latestDebtPayment?.payDebt_id // Tambahkan payDebt_id ke response
    });
  } catch (error) {
    console.error('Error fetching latest debt payment and order:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};





module.exports = {
  createDebtPayment,
  getAllDebtPayments,
  getByIdCustomerId,
  getLatestPaydebtAndOrderByCustomerId
};
