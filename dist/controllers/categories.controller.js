"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const sequelize_1 = require("sequelize");
const Category_1 = __importDefault(require("../models/Category"));
const getCategories = async (req, res) => {
    try {
        const categories = await Category_1.default.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
        });
        res.json({
            message: 'All Categories',
            data: categories
        });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;
        if (!name) {
            res.status(400).json({ message: 'Category name is required' });
            return;
        }
        const existingCategory = await Category_1.default.findOne({ where: { name } });
        if (existingCategory) {
            res.status(400).json({ message: 'Category already exists' });
            return;
        }
        const category = await Category_1.default.create({ name, userId: userId });
        res.json({
            message: 'Category Created Successfully',
            data: category
        });
    }
    catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ message: 'Category name is required' });
            return;
        }
        const category = await Category_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        const existingCategory = await Category_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: id } }
        });
        if (existingCategory) {
            res.status(400).json({ message: 'Category name already exists' });
            return;
        }
        await category.update({ name });
        res.json({
            message: 'Category Updated Successfully',
            data: category
        });
    }
    catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        await category.destroy();
        res.json({
            message: 'Category deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteCategory = deleteCategory;
