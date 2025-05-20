"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const sequelize_1 = require("sequelize");
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const getProducts = async (req, res) => {
    try {
        const { categoryId, minPrice, maxPrice, minRating, search, page = 1, } = req.query;
        const limit = 10;
        const whereClause = {};
        if (categoryId) {
            whereClause.categoryId = categoryId;
        }
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice)
                whereClause.price[sequelize_1.Op.gte] = minPrice;
            if (maxPrice)
                whereClause.price[sequelize_1.Op.lte] = maxPrice;
        }
        if (minRating) {
            whereClause.rating = { [sequelize_1.Op.gte]: minRating };
        }
        if (search) {
            whereClause.name = { [sequelize_1.Op.like]: `%${search}%` };
        }
        const offset = (Number(page) - 1) * Number(limit);
        const { count, rows: products } = await Product_1.default.findAndCountAll({
            where: whereClause,
            include: [{ model: Category_1.default, as: 'category', attributes: ['id', 'name'] }],
            limit: Number(limit),
            offset,
            order: [['createdAt', 'DESC']],
        });
        res.json({
            message: 'All Products',
            data: {
                count,
                pages: Math.ceil(count / Number(limit)),
                currentPage: Number(page),
                products,
            }
        });
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findByPk(req.params.id, {
            include: [{ model: Category_1.default, as: 'category', attributes: ['id', 'name'] }],
        });
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json({
            message: 'Product details',
            data: product
        });
    }
    catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId } = req.body;
        const userId = req.user.id;
        if (!name || !price || !categoryId) {
            res.status(400).json({ message: 'Name, price and category are required' });
            return;
        }
        const category = await Category_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        const product = await Product_1.default.create({
            name,
            description,
            price,
            categoryId,
            userId
        });
        res.json({
            message: 'Product Created Successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId } = req.body;
        if (!name || !price || !categoryId) {
            res.status(400).json({ message: 'Name, price and category are required' });
            return;
        }
        const product = await Product_1.default.findByPk(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        if (categoryId) {
            const category = await Category_1.default.findByPk(categoryId);
            if (!category) {
                res.status(404).json({ message: 'Category not found' });
                return;
            }
        }
        await product.update({
            name,
            description,
            price,
            categoryId
        });
        res.json({
            message: 'Product Updated Successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product_1.default.findByPk(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        await product.destroy();
        res.json({
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteProduct = deleteProduct;
