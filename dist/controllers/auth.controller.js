"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrders = exports.getUserDetails = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const User_1 = __importDefault(require("../models/User"));
const Order_1 = __importDefault(require("../models/Order"));
const OrderItem_1 = __importDefault(require("../models/OrderItem"));
/*
  @desc   Register new user
  @route  POST /auth/register
  @access Public
  @body   name - User's full name
          email - User's email address
          password - User's password
*/
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Name, email and password are required' });
            return;
        }
        const existingUser = await User_1.default.findOne({
            where: { email }
        });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = await User_1.default.create({
            name,
            email,
            password,
            type: 'user'
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, config_1.JWT_SECRET, { expiresIn: '24h' });
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
/*
  @desc   Login user
  @route  POST /auth/login
  @access Public
  @body   email - User's email address
          password - User's password
*/
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const user = await User_1.default.findOne({
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
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, config_1.JWT_SECRET, { expiresIn: '24h' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
const logout = (_req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 0
        });
        res.status(200).json({ message: 'Logout successfully' });
    }
    catch (error) {
        console.error('Error in user logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.logout = logout;
/*
  @desc   Get User's Details
  @route  GET /auth/me
  @access Private
*/
const getUserDetails = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        const user = await User_1.default.findOne({
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
    }
    catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserDetails = getUserDetails;
/*
  @desc   Get User's Orders
  @route  GET /auth/me/orders
  @access Private
*/
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        const orders = await Order_1.default.findAll({
            where: { userId },
            include: [{
                    model: OrderItem_1.default,
                    as: 'orderItems'
                }],
            order: [['createdAt', 'DESC']]
        });
        res.json({
            message: 'User Orders',
            data: orders
        });
    }
    catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserOrders = getUserOrders;
