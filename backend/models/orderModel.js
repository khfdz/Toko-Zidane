const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    name: { type: String, required: true } // Pastikan ini ada
  },
  cart: {
    items: [
      {
        product: {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
          totalPriceProduct: { type: Number, required: true }
        },
        _id: { type: mongoose.Schema.Types.ObjectId }
      }
    ],
    note: { type: String },
    discount: { type: Number, default: 0 },
    additionalText: { type: String },
    additionalPrice: { type: Number, default: 0 },
    cr_id: { type: String },
    totalProduct: { type: Number },
    totalQuantity: { type: Number },
    subTotal: { type: Number },
    totalPrice: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date }
  },
  paymentAmount: { type: Number, required: true },
  change: { type: Number, default: 0 },
  debt: { type: Number, default: 0 },
  status: { type: String, default: 'processing' },
  order_id: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
