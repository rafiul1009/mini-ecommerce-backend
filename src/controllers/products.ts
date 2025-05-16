import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Product from '../models/Product';
import Category from '../models/Category';
import { AppError } from '../middlewares/error';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const whereClause: any = {};

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }

    if (minRating) {
      whereClause.rating = { [Op.gte]: minRating };
    }

    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [{ model: Category, attributes: ['id', 'name'] }],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      products,
    });
  } catch (error) {
    throw new AppError('Error fetching products', 500);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['id', 'name'] }],
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error fetching product', 500);
  }
};