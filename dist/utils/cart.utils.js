"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartItems = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const getCartItems = async (cart, userId) => {
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
    return {
        items: cartItems,
        total
    };
};
exports.getCartItems = getCartItems;
