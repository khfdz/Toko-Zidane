const mongoose = require('mongoose');

// Define the schema for a category
const categorySchema = new mongoose.Schema({
  ct_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create the model from the schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
