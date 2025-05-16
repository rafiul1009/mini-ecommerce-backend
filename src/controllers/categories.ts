import { Request, Response } from 'express';
import Category from '../models/Category';
import { AppError } from '../middlewares/error';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    throw new AppError('Error fetching categories', 500);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      throw new AppError('Category already exists', 400);
    }

    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error creating category', 500);
  }
};