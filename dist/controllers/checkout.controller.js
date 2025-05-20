"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
const Order_1 = __importDefault(require("../models/Order"));
const OrderItem_1 = __importDefault(require("../models/OrderItem"));
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const checkout = async (req, res) => {
    const transaction = await database_config_1.default.transaction();
    try {
        const userId = req.user.id;
        const cart = req.session.cart || {};
        // Filter cart items for current user
        const userCart = Object.entries(cart)
            .filter(([key]) => key.startsWith(userId + "_"))
            .reduce((acc, [_, value]) => ({ ...acc, [value.productId]: value }), {});
        if (Object.keys(userCart).length === 0) {
            res.status(400).json({ message: 'Cart is empty' });
            return;
        }
        // Create order
        const order = await Order_1.default.create({
            userId,
            total: 0, // Will be calculated based on order items
        }, { transaction });
        let orderTotal = 0;
        // Create order items and check inventory
        for (const [productId, item] of Object.entries(userCart)) {
            const product = await Product_1.default.findByPk(item.productId, { transaction });
            if (!product) {
                await transaction.rollback();
                res.status(404).json({ message: `Product with ID ${item.productId} not found` });
                return;
            }
            const category = await Category_1.default.findByPk(product.categoryId, { transaction });
            const itemTotal = product.price * item.quantity;
            orderTotal += itemTotal;
            // Create order item with product and category details
            await OrderItem_1.default.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: itemTotal,
                productName: product.name,
                productDescription: product.description || '',
                productPrice: product.price,
                categoryId: product.categoryId,
                categoryName: category?.name || '',
            }, { transaction });
        }
        // Update order total
        await order.update({ total: orderTotal }, { transaction });
        // Commit transaction
        await transaction.commit();
        // Only clear current user's cart items
        const updatedCart = Object.entries(req.session.cart || {})
            .filter(([key]) => !key.startsWith(userId + "_"))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        req.session.cart = updatedCart;
        // Fetch the completed order with items
        const completedOrder = await Order_1.default.findByPk(order.id, {
            include: [{
                    model: OrderItem_1.default,
                    as: 'orderItems'
                }]
        });
        res.status(201).json({
            message: 'Order created successfully',
            data: completedOrder
        });
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error processing checkout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.checkout = checkout;
