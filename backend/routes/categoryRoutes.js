const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategoryById,
    deleteCategoryById
} = require('../controllers/categoryController');

// Get all categories
router.get('/', authenticate, getAllCategories);

// Get category by ct_id
router.get('/:ct_id', authenticate, getCategoryById);

// Create new category
router.post('/', authenticate, createCategory);

// Update category by ct_id
router.put('/:ct_id', authenticate, updateCategoryById);

// Delete category by ct_id
router.delete('/:ct_id', authenticate, deleteCategoryById);

module.exports = router;
