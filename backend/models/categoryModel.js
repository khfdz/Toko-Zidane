const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID library for unique ID generation

const categorySchema = new mongoose.Schema({
  ct_id: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `CT-${uuidv4().split('-')[0].toUpperCase()}`; // Generate ID like CT-1234
    }
  },
  name: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
