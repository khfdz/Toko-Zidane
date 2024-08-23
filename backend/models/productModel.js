const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID library for unique ID generation

const productSchema = new mongoose.Schema({
  pd_id: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `PD-${uuidv4().split('-')[0].toUpperCase()}`; // Generate ID like PD-1234
    }
  },
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
