const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null // Default to null if no category is provided
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  cost_price: {
    type: Number,
    required: false
  },
  retail_price: {
    type: Number,
    required: false
  },
  wholesale_price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: false
  },
  barcode: {
    type: String,
    required: false
  },
  image: {
    type: String, // URL or path to image
    required: false
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
