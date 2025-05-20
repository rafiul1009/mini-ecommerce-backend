import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, NODE_ENV } from '../config';
import { AuthRequest } from '../middlewares/auth.middleware';
import User from '../models/User';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';

/*
  @desc   Register new user
  @route  POST /auth/register
  @access Public
  @body   name - User's full name
          email - User's email address
          password - User's password
*/
export const register: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email and password are required' });
      return;
    }

    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      type: 'user'
    });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Login user
  @route  POST /auth/login
  @access Public
  @body   email - User's email address
          password - User's password
*/
export const login: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      message: 'Login successful',
      data: user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout: RequestHandler = (_req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0
    });

    res.status(200).json({ message: 'Logout successfully' });
  } catch (error) {
    console.error('Error in user logout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Get User's Details
  @route  GET /auth/me
  @access Private
*/

export const getUserDetails: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const user = await User.findOne({
      where: { id: userId }
    });

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    res.json({
      message: 'User Details',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/*
  @desc   Get User's Orders
  @route  GET /auth/me/orders
  @access Private
*/
export const getUserOrders: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const orders = await Order.findAll({
      where: { userId },
      include: [{
        model: OrderItem,
        as: 'orderItems'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'User Orders',
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};