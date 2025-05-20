"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_HOST = exports.DB_PASSWORD = exports.DB_USER = exports.DB_NAME = exports.JWT_SECRET = exports.FRONTEND_URL = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.PORT = process.env.PORT || 3000;
exports.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
exports.JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
exports.DB_NAME = process.env.DB_NAME || 'mini_ecommerce';
exports.DB_USER = process.env.DB_USER || 'root';
exports.DB_PASSWORD = process.env.DB_PASSWORD || '';
exports.DB_HOST = process.env.DB_HOST || 'localhost';
if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET not set in environment variables. Using fallback secret key.');
}
