import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Product from '../models/Product';
import Category from '../models/Category';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      search,
      page = 1,
    } = req.query;

    const limit = 10;
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
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
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
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({
      message: 'Product details',
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, categoryId } = req.body;
    const userId = req.user!.id;

    if (!name || !price || !categoryId) {
      res.status(400).json({ message: 'Name, price and category are required' });
      return;
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const product = await Product.create({
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
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      res.status(400).json({ message: 'Name, price and category are required' });
      return;
    }

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
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
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    await product.destroy();

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};