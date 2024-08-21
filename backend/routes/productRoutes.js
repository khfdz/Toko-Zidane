const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const Category = require('../models/categoryModel'); // Import category model for relationship
const upload = require('../config/multer'); // Import multer configuration

// Ensure that the 'Semua' category exists
const getDefaultCategory = async () => {
  let semuaCategory = await Category.findOne({ name: 'Semua' });
  if (!semuaCategory) {
    semuaCategory = new Category({ name: 'Semua' });
    await semuaCategory.save();
  }
  return semuaCategory;
};

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  const { category, name, cost_price, retail_price, wholesale_price, stock, barcode } = req.body;
  const image = req.file ? req.file.path : null; // Get the image path from multer

  try {
    let categoryId;
    if (category) {
      // Check if provided category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
      categoryId = category;
    } else {
      // Use default 'Semua' category if not provided
      const defaultCategory = await getDefaultCategory();
      categoryId = defaultCategory._id;
    }

    const product = new Product({
      category: categoryId,
      name,
      cost_price,
      retail_price,
      wholesale_price,
      stock,
      barcode,
      image
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name'); // Populate category name
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update product by id
router.put('/:id', upload.single('image'), async (req, res) => {
  const { category, name, cost_price, retail_price, wholesale_price, stock, barcode } = req.body;
  const image = req.file ? req.file.path : null; // Get the image path from multer

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { category, name, cost_price, retail_price, wholesale_price, stock, barcode, image },
      { new: true } // Return updated product
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete product by id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
