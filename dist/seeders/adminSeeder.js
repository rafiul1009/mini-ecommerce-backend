"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User_1.default.findOne({
            where: { email: 'admin@yopmail.com' }
        });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }
        await User_1.default.create({
            name: 'Admin',
            email: 'admin@yopmail.com',
            password: '1234',
            type: 'admin'
        });
        console.log('Admin user created successfully');
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
        throw error;
    }
};
exports.seedAdmin = seedAdmin;
