import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Category from '../models/Category';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });

    res.json({
      message: 'All Categories',
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user!.id;

    if (!name) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      res.status(400).json({ message: 'Category already exists' });
      return;
    }

    const category = await Category.create({ name, userId: userId });

    res.json({
      message: 'Category Created Successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Category name is required' });
      return;
    }

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const existingCategory = await Category.findOne({
      where: { name, id: { [Op.ne]: id } }
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
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    await category.destroy();

    res.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};