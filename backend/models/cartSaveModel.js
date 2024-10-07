const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const cartSaveSchema = new mongoose.Schema({
  save_id: {
    type: String,
    required: true,
    default: () => `SAVE-${uuidv4().split('-')[0].toUpperCase()}`,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  // Tambahkan additionalItems disini
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
          },
          totalPriceProduct: {
            type: Number,
            default: function() {
              return this.price * this.quantity;
            }
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
    default: function() {
      return this.items.length;
    }
  },
  totalQuantity: {
    type: Number,
    required: true,
    default: function() {
      return this.items.reduce((acc, item) => acc + item.product.quantity, 0);
    }
  },
  note: {
    type: String,
    default: ''
  },
  discount: {
    type: Number,
    default: 0
  },
  additionalText: {
    type: String,
    default: ''
  },
  additionalPrice: {
    type: Number,
    default: 0
  },
  subTotal: {
    type: Number,
    required: true,
    default: function() {
      return this.items.reduce((acc, item) => acc + item.product.totalPriceProduct, 0);
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    default: function() {
      return this.subTotal + this.additionalPrice - this.discount;
    }
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('CartSave', cartSaveSchema);
