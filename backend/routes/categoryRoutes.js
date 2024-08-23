const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel');
const authenticate = require('../middlewares/authenticate');

// Get all categories
router.get('/', authenticate, async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get category by ct_id
router.get('/:ct_id', authenticate, async (req, res) => {
    try {
        const category = await Category.findOne({ ct_id: req.params.ct_id });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Create new category
router.post('/', authenticate, async (req, res) => {
    const { ct_id, name } = req.body;
    try {
        const categoryExists = await Category.findOne({ ct_id });
        if (categoryExists) return res.status(400).json({ message: 'Category already exists' });

        const category = new Category({ ct_id, name });
        await category.save();

        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update category by ct_id
router.put('/:ct_id', authenticate, async (req, res) => {
    const { name } = req.body;
    try {
        const category = await Category.findOneAndUpdate(
            { ct_id: req.params.ct_id },
            { name },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete category by ct_id
router.delete('/:ct_id', authenticate, async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ ct_id: req.params.ct_id });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
