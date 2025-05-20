"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const User_1 = __importDefault(require("../models/User"));
const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const user = await User_1.default.findOne({
            where: { id: req.user.id },
            attributes: ['type']
        });
        if (!user || user.type !== 'admin') {
            res.status(403).json({ message: 'Access denied. Admin only.' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.adminMiddleware = adminMiddleware;
