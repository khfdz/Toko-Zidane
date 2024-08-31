const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    default: () => `ORD-${uuidv4().split('-')[0].toUpperCase()}`,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    default: 'Pelanggan Setia'
  },
  items: [
    {
      product: {
        type: new mongoose.Schema({
          price: {
            type: Number,
            required: true
          },
          name: {
            type: String,
            required: true
          },
          quantity: {
            type: Number,
            required: true
          },
          totalPriceProduct: {
            type: Number,
            required: true
          }
        }, { _id: false }),
        required: true
      }
    }
  ],
  totalProduct: {
    type: Number,
    required: true
  },
  totalQuantity: {
    type: Number,
    required: true
  },
  subTotal: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentAmount: {
    type: Number,
    required: false
  },
  change: {
    type: Number,
    required: false
  },
  debt: {
    type: Number,
    required: false
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  },
  additionalText: {
    type: String,
    default: ''
  },
  discount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Sent', 'Processing', 'Completed'],
    default: 'Sent'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
