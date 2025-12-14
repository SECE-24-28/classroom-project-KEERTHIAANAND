const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to get or create cart
const getOrCreateCart = async (sessionId) => {
    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
        cart = await Cart.create({ sessionId, items: [] });
    }
    return cart;
};

/**
 * @route   GET /api/cart
 * @desc    Get cart items
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        // Using a default session ID for now (in production, use actual sessions/auth)
        const sessionId = req.query.sessionId || 'default-session';
        const cart = await getOrCreateCart(sessionId);

        res.status(200).json({
            success: true,
            data: cart.items,
            totalAmount: cart.totalAmount,
            totalItems: cart.totalItems
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching cart',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        const { id, name, price, category, image, quantity } = req.body;
        const sessionId = req.body.sessionId || 'default-session';

        if (!id || !name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Product id, name, and price are required'
            });
        }

        const cart = await getOrCreateCart(sessionId);

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.productId === id.toString()
        );

        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity += (quantity || 1);
        } else {
            cart.items.push({
                productId: id.toString(),
                name,
                price,
                category,
                image,
                quantity: quantity || 1
            });
        }

        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Item added to cart',
            data: cart.items,
            totalAmount: cart.totalAmount,
            totalItems: cart.totalItems
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding to cart',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/cart/:productId
 * @desc    Update cart item quantity
 * @access  Public
 */
router.put('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const sessionId = req.body.sessionId || 'default-session';

        const cart = await getOrCreateCart(sessionId);

        const itemIndex = cart.items.findIndex(
            item => item.productId === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            data: cart.items,
            totalAmount: cart.totalAmount,
            totalItems: cart.totalItems
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating cart',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove item from cart
 * @access  Public
 */
router.delete('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const sessionId = req.query.sessionId || 'default-session';

        const cart = await getOrCreateCart(sessionId);

        const itemIndex = cart.items.findIndex(
            item => item.productId === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: cart.items,
            totalAmount: cart.totalAmount,
            totalItems: cart.totalItems
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing from cart',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/cart
 * @desc    Clear entire cart
 * @access  Public
 */
router.delete('/', async (req, res) => {
    try {
        const sessionId = req.query.sessionId || 'default-session';
        const cart = await getOrCreateCart(sessionId);

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            data: cart.items,
            totalAmount: 0,
            totalItems: 0
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while clearing cart',
            error: error.message
        });
    }
});

module.exports = router;
