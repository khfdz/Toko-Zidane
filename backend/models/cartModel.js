const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const cartSchema = new mongoose.Schema({
  cr_id: {
    type: String,
    required: true,
    default: () => `CR-${uuidv4().split('-')[0].toUpperCase()}`,
    unique: true
  },
  customer: {
    name: {
      type: String,
      default: 'Pelanggan Setia'
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
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
  additionalItems: [
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
          }
        }, { _id: false }),
        required: true
      },
      _id: {
        type: String,
        default: uuidv4
      }
    }
  ],
  totalProduct: {
    type: Number,
    required: true,
    default: 0
  },
  totalQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  note: {
    type: String,
    default: ''
  },
  discount: {
    type: Number,
    default: 0
  },
  subTotal: {
    type: Number,
    required: true,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

// Pre-save hook to calculate subtotal and total price
cartSchema.pre('save', function(next) {
  const itemTotal = this.items.reduce((acc, item) => acc + item.product.totalPriceProduct, 0);
  const additionalTotal = this.additionalItems.reduce((acc, item) => acc + item.product.price * item.product.quantity, 0);
  
  this.subTotal = itemTotal + additionalTotal;
  this.totalPrice = this.subTotal - this.discount;
  
  this.totalQuantity = this.items.reduce((acc, item) => acc + item.product.quantity, 0) +
                       this.additionalItems.reduce((acc, item) => acc + item.product.quantity, 0);
  
  this.totalProduct = this.items.length + this.additionalItems.length;

  next();
});

module.exports = mongoose.model('Cart', cartSchema);
