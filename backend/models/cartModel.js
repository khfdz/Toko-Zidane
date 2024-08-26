// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid');

// const cartSchema = new mongoose.Schema({
//   cr_id: {
//     type: String,
//     required: true,
//     default: () => `CT-${uuidv4().split('-')[0].toUpperCase()}`,
//     unique: true
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true
//   },
//   items: [
//     {
//       product: {
//         type: new mongoose.Schema({
//           price: {
//             type: Number,
//             required: true
//           },
//           name: {
//             type: String,
//             required: true
//           },
//           quantity: {
//             type: Number,
//             required: true
//           },
//           totalPriceProduct: {
//             type: Number,
//             required: true
//           }
//         }, { _id: false }),
//         required: true
//       }
//     }
//   ],
//   note: {
//     type: String,
//     default: ''
//   },
//   discount: {
//     type: Number,
//     default: 0
//   },
//   additionalText: {
//     type: String,
//     default: ''
//   },
//   additionalPrice: {
//     type: Number,
//     default: 0
//   },
//   subTotal: {
//     type: Number,
//     required: true
//   },
//   totalPrice: {
//     type: Number,
//     required: true
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Cart', cartSchema);

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const cartSchema = new mongoose.Schema({
  cr_id: {
    type: String,
    required: true,
    default: () => `CR-${uuidv4().split('-')[0].toUpperCase()}`,
    unique: true
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
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
