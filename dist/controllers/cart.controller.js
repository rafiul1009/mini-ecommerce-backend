"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.getCart = exports.addToCart = void 0;
require("express-session");
const Product_1 = __importDefault(require("../models/Product"));
const cart_utils_1 = require("../utils/cart.utils");
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        if (!productId || quantity === undefined || quantity === null) {
            res.status(400).json({ message: 'Product ID and quantity are required' });
            return;
        }
        if (!req.session) {
            res.status(400).json({ message: 'Session is not available' });
            return;
        }
        if (!req.session?.cart) {
            req.session.cart = {};
        }
        const product = await Product_1.default.findByPk(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        const cartKey = userId + "_" + productId;
        const cartItem = req.session.cart[cartKey] || { productId, quantity: 0 };
        if (quantity === 0) {
            delete req.session.cart[cartKey];
            const cart = req.session?.cart || {};
            const cartItems = await (0, cart_utils_1.getCartItems)(cart, userId);
            res.json({
                message: 'Item removed from cart',
                data: cartItems
            });
            return;
        }
        // For non-zero quantities, validate they are positive
        if (quantity < 0) {
            res.status(400).json({ message: 'Quantity cannot be negative' });
            return;
        }
        cartItem.quantity = quantity; // Set absolute quantity instead of adding
        req.session.cart[cartKey] = cartItem;
        const cart = req.session?.cart || {};
        const cartItems = await (0, cart_utils_1.getCartItems)(cart, userId);
        res.json({
            message: 'Cart updated successfully',
            data: cartItems
        });
    }
    catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res) => {
    try {
        if (!req.session) {
            res.status(400).json({ message: 'Session is not available' });
            return;
        }
        const userId = req.user.id;
        const cart = req.session?.cart || {};
        const cartItems = [];
        let total = 0;
        // Filter cart items for current user
        for (const [key, item] of Object.entries(cart)) {
            if (!key.startsWith(userId + "_"))
                continue;
            const product = await Product_1.default.findByPk(item.productId);
            if (product) {
                const itemTotal = product.price * item.quantity;
                cartItems.push({
                    product,
                    quantity: item.quantity,
                    total: itemTotal,
                });
                total += itemTotal;
            }
        }
        res.json({
            message: 'Cart retrieved successfully',
            data: {
                items: cartItems,
                total
            }
        });
    }
    catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCart = getCart;
const clearCart = (req, res) => {
    try {
        const userId = req.user.id;
        // Only clear current user's cart items
        const updatedCart = Object.entries(req.session.cart || {})
            .filter(([key]) => !key.startsWith(userId + "_"))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        req.session.cart = updatedCart;
        res.json({
            message: 'Cart cleared successfully',
            data: null
        });
    }
    catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.clearCart = clearCart;
