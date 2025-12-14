const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * @route   GET /api/products
 * @desc    Get all products with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort } = req.query;

        // Build query object
        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Build sort object
        let sortOption = {};
        if (sort === 'price_asc') sortOption.price = 1;
        else if (sort === 'price_desc') sortOption.price = -1;
        else if (sort === 'name_asc') sortOption.name = 1;
        else if (sort === 'name_desc') sortOption.name = -1;
        else sortOption.createdAt = -1; // Default: newest first

        const products = await Product.find(query).sort(sortOption);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);

        // Check if error is due to invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while fetching product',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public (would typically be admin-only)
 */
router.post('/', async (req, res) => {
    try {
        const { name, price, category, image, description, stock } = req.body;

        // Validation
        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, price, and category'
            });
        }

        const product = await Product.create({
            name,
            price: parseFloat(price),
            category,
            image: image || undefined,
            description,
            stock: stock || 100
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating product',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Public (would typically be admin-only)
 */
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while updating product',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Public (would typically be admin-only)
 */
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: product
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting product',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/products/categories/list
 * @desc    Get all unique categories
 * @access  Public
 */
router.get('/categories/list', async (req, res) => {
    try {
        const categories = await Product.distinct('category');

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching categories',
            error: error.message
        });
    }
});

module.exports = router;
