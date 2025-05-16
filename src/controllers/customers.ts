import { Request, Response } from 'express';
import Customer from '../models/Customer';
import { AppError } from '../middlewares/error';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: customers } = await Customer.findAndCountAll({
      limit: Number(limit),
      offset,
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      count,
      pages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      customers,
    });
  } catch (error) {
    throw new AppError('Error fetching customers', 500);
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;

    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      throw new AppError('Customer with this email already exists', 400);
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      customer,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error creating customer', 500);
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    res.json({
      success: true,
      customer,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error fetching customer', 500);
  }
};