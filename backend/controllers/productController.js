const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const upload = require('../middlewares/upload'); // Import multer middleware

// Create new product with image upload
const createProduct = async (req, res) => {
  const { category, name, cost_price, wholesale_price, stock, barcode } = req.body;
  const image = req.file ? `/uploads/products/${req.file.filename}` : null;

  try {
    // Find the category by ct_id
    const categoryDoc = await Category.findOne({ ct_id: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const product = new Product({
      category: categoryDoc._id, // Use the ObjectId of the found category
      name,
      cost_price,
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
};

const getAllProducts = async (req, res) => {
  const { ct_id, search } = req.query; // Ambil ct_id dan search dari query params

  try {
    let query = {};

    // Filter by ct_id di kategori
    if (ct_id) {
      // Jika ct_id adalah array
      const ctIds = Array.isArray(ct_id) ? ct_id : [ct_id];

      // Cari kategori berdasarkan ct_id dan ambil _id-nya
      const categories = await Category.find({ ct_id: { $in: ctIds } });
      if (categories.length === 0) {
        return res.status(404).json({ message: 'Categories not found' });
      }

      // Filter produk berdasarkan _id kategori yang ditemukan
      query.category = { $in: categories.map(category => category._id) };
    }

    // Search by name or barcode
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive name search
        { barcode: { $regex: search, $options: 'i' } } // Case-insensitive barcode search
      ];
    }

    // Ambil produk dan populate kategori (name dan ct_id)
    const products = await Product.find(query).populate('category', 'name ct_id');

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


  
  
// Get product by pd_id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ pd_id: req.params.pd_id }).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update product with image upload
const updateProductById = async (req, res) => {
  const { category, name, cost_price, retail_price, wholesale_price, stock, barcode } = req.body;
  const image = req.file ? `/uploads/products/${req.file.filename}` : null;

  try {
    const updatedData = {
      category,
      name,
      cost_price,
      retail_price,
      wholesale_price,
      stock,
      barcode,
    };

    if (image) {
      updatedData.image = image;
    }

    const product = await Product.findOneAndUpdate(
      { pd_id: req.params.pd_id },
      updatedData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete product by pd_id
const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ pd_id: req.params.pd_id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Export all functions at the end
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById
};
