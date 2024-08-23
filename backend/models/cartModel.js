const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const cartSchema = new mongoose.Schema({
  cr_id: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `CR-${uuidv4().split('-')[0].toUpperCase()}`; // Generate ID like CR-1234
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['active', 'processing', 'completed'],
    default: 'active'
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Pre-save middleware to calculate total price
cartSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
