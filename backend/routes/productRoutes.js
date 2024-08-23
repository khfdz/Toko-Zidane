const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate'); // Middleware for authentication
const upload = require('../middlewares/upload'); // Import multer middleware
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById
} = require('../controllers/productController');

// Create new product with image upload
router.post('/', authenticate, upload.single('image'), createProduct);

// Get all products
router.get('/', getAllProducts);

// Get product by pd_id
router.get('/:pd_id', getProductById);

// Update product with image upload
router.put('/:pd_id', authenticate, upload.single('image'), updateProductById);

// Delete product by pd_id
router.delete('/:pd_id', authenticate, deleteProductById);

module.exports = router;
